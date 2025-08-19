from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings

from accounts.api.serializers import (
    RegisterSerializer,
    LoginSerializer,
    RefreshTokenSerializer
)


# helper function
def make_token_response_for_user(
    user, status_code=status.HTTP_200_OK, message="Success"
):
    refresh = RefreshToken.for_user(user)
    response = Response({"message": message}, status=status_code)

    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=604800,  # 7 days
        path="/",
    )

    # add an access token for immediate use
    access_token = refresh.access_token
    response.data["access_token"] = str(access_token)
    response.data["access_token_exp"] = access_token['exp']   
    return response


class RegisterView(APIView):
    serializer_class = RegisterSerializer
    parser_classes = [JSONParser]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username, 
            password=password
        )
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(
                {
                    "message": "Login failed",
                    "errors": e.detail
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = serializer.validated_data['user']

        return make_token_response_for_user(
            user, 
            status_code=status.HTTP_200_OK, 
            message="Login success"
        )


class RefreshTokenView(APIView):
    
    def post(self, request):

        received_token = request.COOKIES.get('refresh_token')
            
        if not received_token:
            return Response(
                {'error': 'Invalid refresh token or not recieved',},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(received_token)

            new_access_token = refresh.access_token
            return Response(
                {
                    'access_token':str(new_access_token),
                    'access_token_exp':new_access_token['exp'],
                },
                status=status.HTTP_200_OK
            )
        except (TokenError, InvalidToken):
            return Response(
                {'error': 'Invalid refresh token or not recieved',},
                 status=status.HTTP_400_BAD_REQUEST
            )

class LogoutView(APIView):
    def post(self, request):
        response = Response(
            {"message": "Logout successful"}, 
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            key="refresh_token",
            path="/",
            domain=None
        )
        return response