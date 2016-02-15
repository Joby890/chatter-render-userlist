export default function(chatter) {

  //Listen for plugin enable
  this.onEnable = function() {
    var self = this;

    //Create UserList React Component
    var UserList = React.createClass({

      //Save users and length in state
      getInitialState: function() {
        return {
          users: {},
          lastLenght: 0,
        };
      },

      //Handler for user status updates from server
      listForUsers: function(data) {
        //Add or update user to state and update length
        var users = this.state.users;
        var lastLenght = this.state.lastLenght;
        if(users[data.user] === undefined) {
          lastLenght++;
        }
        users[data.user] = data.online;
        this.setState({
          users: users,
          lastLenght: lastLenght
        });
      },
      //listen for events from server on mount
      componentDidMount: function() {
        socket.on("userUpdate", this.listForUsers);
      },
      //stop listening for events form server
      componentWillUnmount: function() {
        socket.removeListener("userUpdate", this.listForUsers);
      },
      //on render reduce users to an array and render all users
      render: function() {
        var users = _.reduce(this.state.users, function(array, online, id) {
          var color = online ? "green" : "red";
          array.push(React.createElement("div", {key: id, style: {color:color}}, id));
          return array;
        }, []);
        var text = "UserList (" + this.state.lastLenght + ")";
        return React.createElement("div", null, text, users);
      }
    });
    //On enable add userlist page to left panel.
    chatter.getPanel('left').addPage(this, new Page('UserList', 5, UserList, null, [], true));
  };


}
