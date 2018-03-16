/**
 * Developer is a generic page template for Developers.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { Label } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import DeveloperStyles from './DeveloperStyles';
import InstanceDetails from '../InstanceDetails';

import CommonAssets from '../../inline-styles/CommonAssets';

/**
 * @description - Helper method for generating a component
 * to hold a screenshot
 * @param {Object} props
 * @param {String} props.src
 * @param {String} props.alt
 * @returns {React.Component}
 */
function screenshot({ url, alt }) {
  const src = url.indexOf('http') >= 0 ? url : `https://${url}`;
  return (
    <div
      key={`${url}-div-image`}
      style={[DeveloperStyles.imageContainer]}
    >
      <div>
        <a href={src}>
          <img
            key={`${url}-image`}
            src={src}
            alt={alt}
            style={[DeveloperStyles.image]}
          />
        </a>
      </div>
    </div>
  );
}

screenshot.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

screenshot.defaultProps = {
  alt: '',
};

/**
 * @description - Helper method for rendering a link to a game or article
 * @param {Object} props
 * @param {String} url
 * @param {String} name
 * @returns {React.Component}
 */
function link({ label, url, key }) {
  return (
    <Link key={key} to={url} style={{ textDecoration: 'none' }}>
      <Label>{label}</Label>
    </Link>
  );
}

link.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

/**
 * @description - Returns the main component to render a developer's own
 * page
 * @param {Object} props
 * @returns {React.Component}
 */
class Developer extends React.Component {
  static propTypes = {
    // this is derived state using selectors
    articles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
    // this is derived state using selectors
    games: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })),
    country: PropTypes.string,
    logoURL: PropTypes.string,
    twitter: PropTypes.object, //eslint-disable-line
    foundation: PropTypes.string,
    website: PropTypes.string,
    // we currently don't use these but we may in the future
    error: PropTypes.string, //eslint-disable-line
    requested: PropTypes.bool, //eslint-disable-line

    fetchDeveloper: PropTypes.func.isRequired,
  };

  static defaultProps = {
    articles: [],
    name: '',
    games: [],
    country: '',
    logoURL: '',
    twitter: null,
    foundation: '',
    website: '',
    error: null,
    requested: false,
  };

  /**
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchDeveloper();
  }

  render() {
    return (
      <div>
        <div style={[
            CommonAssets.stripeOverlay,
            CommonAssets.fillBackground,
          ]}
        />
        <InstanceDetails
          style={{
            container: undefined,
            border: DeveloperStyles.border,
            jumboTron: DeveloperStyles.jumboTron,
          }}
          twitterWidget={this.props.twitter}
        >
          <div>
            <h1 style={[DeveloperStyles.name]}>{this.props.name}
              <div style={[DeveloperStyles.logo]}>
                <img
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                  src={this.props.logoURL}
                  alt={`${this.props.name} logo`}
                />
              </div>
            </h1>
            <div style={[DeveloperStyles.secondaryInfo]}>
              <p>Established: {this.props.foundation}</p>
              <p>Location: {this.props.country}</p>
              <p>Website: <a href={this.props.website}>{this.props.website}</a></p>
            </div>
          </div>
          <div style={[DeveloperStyles.games]}>
            <h3>Games:</h3>
            {
              this.props.games.length > 0 &&
              <p>
                {
                  this.props.games.map(game => link({
                    label: game.name,
                    url: `/games/${game.id}`,
                    key: `game-${game.id}`,
                  }))
                }
              </p>
            }
          </div>
          <div style={[DeveloperStyles.articles]}>
            <h3>Articles:</h3>
            {
              this.props.articles.length > 0 &&
              <p>
                {
                  this.props.articles.map(article => link({
                    label: article.title,
                    url: `/articles/${article.id}`,
                    key: `article-${article.id}`,
                  }))
                }
              </p>
            }
          </div>
        </InstanceDetails>
      </div>
    );
  }
}

export default Radium(Developer);