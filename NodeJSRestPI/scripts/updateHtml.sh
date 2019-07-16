echo $1
if test "$1" = "create"
then
    cd /c/workarea/autoUIPoc/new/
    # to download
    git clone https://github.com/karungn1/QuickStartWebApplication_frontend.git

    # to install
    cd QuickStartWebApplication_frontend
    npm install

    # start and open in browser
    ng serve --port 4201 --open
    #ng serve --open

    
    #add Login page
    cp /c/workarea/autoUIPoc/new/QuickStartWebApplication_backend/htmls/app.component.html /c/workarea/autoUIPoc/new/QuickStartWebApplication_frontend/src/app/
    cp /c/workarea/autoUIPoc/new/QuickStartWebApplication_backend/htmls/web-speech.component.html /c/workarea/autoUIPoc/new/QuickStartWebApplication_frontend/src/app/web-speech/web-speech.component.html
    #cp /c/workarea/autoUIPoc/new/QuickStartWebApplication_backend/htmls/home.component.html /c/workarea/autoUIPoc/new/QuickStartWebApplication_frontend/src/app/home/home/


    #open VS code
    #code .

    cmd /k

else

    cp /c/workarea/autoUIPoc/new/QuickStartWebApplication_backend/htmls/$1 /c/workarea/autoUIPoc/new/QuickStartWebApplication_frontend/src/app/app.component.html

    cmd /k

fi

cmd /k