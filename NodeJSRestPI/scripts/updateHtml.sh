echo $1
if test "$1" = "create"
then
    cd /c/workarea/autoUIPoc/new/
    # to download
    git clone https://github.ibm.com/karungn1/QuickStartWebApplication.git

    # to install
    cd QuickStartWebApplication
    npm install

    #add Login page
    cp /c/workarea/autoUIPoc/app.component.html /c/workarea/autoUIPoc/new/QuickStartWebApplication/src/app/
    cp /c/workarea/autoUIPoc/home.component.html /c/workarea/autoUIPoc/new/QuickStartWebApplication/src/app/home/home/

    # start and open in browser
    ng serve --open

    #open VS code
    #code .

    cmd /k

else

    cp /c/workarea/autoUIPoc/htmls/$1 /c/workarea/autoUIPoc/new/QuickStartWebApplication/src/app/app.component.html

    cmd /k

fi

cmd /k