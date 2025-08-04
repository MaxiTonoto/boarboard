from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from accounts.api.serializers import CreateUserSerializer, LoginSerializer

# helper function
def make_token_response_for_user(
        user, status_code=status.HTTP_200_OK, message="Success"
    ):
    refresh = RefreshToken.for_user(user)
    response = Response(
        {"message": message},
        status=status_code
    )

    response.set_cookie(
        key='refresh_token',
        value=str(refresh),
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=604800   # 7 days
    )

    # add an access token for immediate use
    response.data['access_token'] = str(refresh.access_token)
    return response


class CreateUserView(APIView):
    parser_classes = [JSONParser]
    serializer_class = CreateUserSerializer

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if (not username) or (not password):
            return Response(
                {'error': 'Username and passowrd are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(password)
        except ValidationError as e:
            return Response(
                {'error': e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(
            username=username, 
            password=password
        )
        return make_token_response_for_user(
            user,
            status_code=status.HTTP_201_CREATED,
            message="User created successfully"
        )


class GetCookieTokenView(APIView):
    serializer_class = LoginSerializer
    
    def post(self, request):
        user = None

        if request.user.is_authenticated:
            user = request.user

            # do not make a new session token if there's an active one
            if 'refresh_token' in request.COOKIES:
                return Response(
                    {'message': 'Already authenticated with active session'},
                    status=status.HTTP_200_OK
                )

            # if the code gets here, make a new one
            return make_token_response_for_user(
                user,
                status=status.HTTP_200_OK,
                message="Session token regenerated"
            )

        else:
            user = authenticate(
                username = request.data.get("username"), 
                password = request.data.get("password")
            )
            
            if user:
                return make_token_response_for_user(
                    user,
                    status_code = status.HTTP_200_OK,
                    message="Login success"
                )
            
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )