(function($){

    jQuery(document).ready(function() {

        jQuery('#button').on('click',function(event){
            debugger;
            event.preventDefault();
            // let id = this.id;
            let files = document.getElementById('textfile').files[0];
            let teacherusername = document.getElementById("teacherusername").value;
            let coursename = document.getElementById("coursename").value;
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
                debugger;
                jQuery("#asslist").append(
                    `<span>
                    <li>
                        ${responseMessage.path};
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