from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

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
        samesite="Strict",
        max_age=604800,  # 7 days
    )

    # add an access token for immediate use
    response.data["access_token"] = str(refresh.access_token)
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
        return make_token_response_for_user(
            user,
            status_code=status.HTTP_201_CREATED,
            message="User created successfully",
        )


class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        if request.user.is_authenticated:
            return Response(
                {"message": "Already authenticated"},
                status=status.HTTP_200_OK,
            )

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        return make_token_response_for_user(
            user, 
            status_code=status.HTTP_200_OK, 
            message="Login success"
        )


class RefreshTokenView(APIView):
    serializer_class = RefreshTokenSerializer
    
    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)

        if serializer.is_valid():
            recieved_token = serializer.validated_data['refresh_token']
            try:
                refresh = RefreshToken(recieved_token)
                session_token = str(refresh.access_token)
                return Response(
                    {'session_token': session_token},
                    status=status.HTTP_200_OK
                )
            except (TokenError, InvalidToken):
                return Response(
                    {'error': 'Invalid refresh token'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
