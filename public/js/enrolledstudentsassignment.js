(function($){
    
    let teacherusername = document.getElementById("teacherusername").value;
    let coursename = document.getElementById("coursename").value;
    let id = document.getElementById("id").vlaue;

    jQuery(document).ready(function() {
        var requestConfig = {
            method: 'Get',
            url: `/student/${ass_sub_bystudents}/${teacherusername}/${coursename}/${id}`,
            contentType: 'json/application'
        };

        jQuery.ajax(requestConfig).then(function(responseMessage){
            responseMessage = responseMessage.assignment;
            // console.log(responseMessage)
            let name = responseMessage.path.split('/');
            let length = name.length
            debugger;
            jQuery("#asslist").append(
                `<span>
                <li>
                    <a href="${responseMessage.path}">
                    ${name[length - 1]};
                    </a>
                </li> 
                <button class ="btn btn-danger" id=""></button>
                </span>
                `
            )
                
        })

        jQuery.ajax(requestConfig).then()
        

        jQuery('#button').on('click',function(event){
            debugger;
            event.preventDefault();
            // let id = this.id;
            let files = document.getElementById('textfile').files[0];
            let teacherusername = document.getElementById("teacherusername").value;
            let coursename = document.getElementById("coursename").value;
            let id = document.getElementById("id").vlaue;
            formData = new FormData();

            // files = document.getElementById('id').value;

            formData.append('textfile',files);
            formData.append('id',id);
            formData.append('teacherusername',teacherusername);
            formData.append('coursename',coursename);
        
            var requestConfig = {
                method: 'POST',
                url: '/student/uploadassignment',
                contentType: 'multipart/form-data',
                data: formData,
                processData: false,
                contentType: false
            };

            jQuery.ajax(requestConfig).then(function(responseMessage){
                responseMessage = responseMessage.assignment;
                // console.log(responseMessage)
                let name = responseMessage.path.split('/');
                let length = name.length
                debugger;
                jQuery("#asslist").append(
                    `<span>
                    <li>
                        <a href="${responseMessage.path}">
                        ${name[length - 1]};
                        </a>
                    </li> 
                    <button class ="btn btn-danger" id=""></button>
                    </span>
                    `
                )
                    
            })

            console.log(id);
            debugger;
        })


        // var requestConfig = {
        //     method: 'GET',
        //     url: '/grades/getassignments',
        //     contentType: 'application/json'
        // };

        // jQuery.ajax(requestConfig).then(function(responseMessage){

        // })
    });

})(jQuery);