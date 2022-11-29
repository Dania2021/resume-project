//here user is the object that's been returned
//from GitHub API
//This object has many methods such as user name,
//login name and links to their profile
function userInformationHTML(user) {
    return `<h2>${user.name}
              <span class="small-name">
                  (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
              </span>
           </h2>
           <div class="gh-content">
              <div class="gh-avatar">
                 <a href="${user.html_url}" target="_blank">
                     <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                 </a>
              </div>
               <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
           </div>`
}

function repoInformationHTML(repos) {
    //GitHub returns this repos object as an array
    if(repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
               </li>`
    });

    return `<div class="clearfix repo-list">
                  <p>
                     <strong>Repo List:</strong>
                  </p>
                  <ul>
                       ${listItemsHTML.join('\n')}
                  </ul>
             </div>`;

}

function fetchGithubInformation(event) {
    $('#gh-user-data').html('');
    $('#gh-repo-data').html('');
    var username = $('#gh-username').val();
    if(!username) {
        $('#gh-user-data').html(`<h2>Please enter a github username</h2>`)
        return; 
    }

    $('#gh-user-data').html(`<div id="loader"><img src="assets/css/loader.gif" alt="loading.."/>
    </div>`)

//when we got a response from the GitHub API
//when() method takes a function as its first argument
$.when(
    $.getJSON(`https://api.github.com/users/${username}`),
    $.getJSON(`https://api.github.com/users/${username}/repos`)

  //function to display it in the gh-user-data div
  //unless we get an error    
).then(
    function(firstResponse, secondResponse) {
        var userData = firstResponse[0];
        var repoData = secondResponse[0];
        $('#gh-user-data').html(userInformationHTML(userData));
        $('#gh-repo-data').html(repoInformationHTML(repoData));
    }, function(errorResponse) {
        if(errorResponse.status === 404) {
            $('#gh-user-data').html(
                `<h2>No info found for user ${username} </h2>`)
         //API Throttling       
        } else if(errorResponse.status === 403) {
            var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
            $('#gh-user-data').html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
        } else {
            console.log(errorResponse);
            $('#gh-user-data').html(
                `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
        }
    });
}

$(document).ready(fetchGithubInformation);