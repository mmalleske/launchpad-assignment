import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import ProgressIndicator from "./components/progress_indicator";
import ProfileList from "./components/profile_list";
import CreateForm from "./components/new_profile_form";

const ProfilesQuery = gql`
  {
    profiles {
      name
      id
    }
  }
`;

const CreateProfileMutation = gql`
  mutation($name: String!) {
    createProfile(name: $name) {
      id
      name
    }
  }
`;

class App extends Component {
  createProfile = async name => {
    await this.props.createProfile({
      variables: {
        name
      },
      update: (store, { data: { createProfile } }) => {
        const data = store.readQuery({ query: ProfilesQuery });
        data.profiles.unshift(createProfile);
        store.writeQuery({ query: ProfilesQuery, data });
      }
    });
  };

  render() {
    const {
      data: { loading, profiles }
    } = this.props;

    if (loading) {
      return <ProgressIndicator />;
    }

    return (
      <div className="mh5">
        <CreateForm submit={this.createProfile} />
        <div className="w-100">
          <ProfileList profiles={profiles} />
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(ProfilesQuery),
  graphql(CreateProfileMutation, { name: "createProfile" }),
)(App);
