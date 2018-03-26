/**
 * Game is a generic page template for Games.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { Badge, Carousel, Jumbotron, Label, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactHTMLParser from 'react-html-parser';

import GameStyles from './GameStyles';
import InstanceDetails from '../InstanceDetails';

import CommonAssets from '../../inline-styles/CommonAssets';

/**
 * @description - Helper method for generating a component
 * to hold a screenshot
 * @param {Object} props
 * @param {String} props.url
 * @param {String} props.alt
 * @returns {React.Component}
 */
function screenshot({ url, alt }) {
  const src = url.indexOf('http') >= 0 ? url : `https://${url}`;
  return (
    <Carousel.Item key={`${url}-carousel-item`} style={{}}>
      <a href={src} key={`${url}-a`} style={{
        display: 'flex',
        width: '100%',
      }}>
        <img
          key={`${url}-image`}
          src={src}
          alt={alt}
          style={{
              maxWidth: '96vw',
              maxHeight: '50vh',
            margin: 'auto',
          }}/>
      </a>
    </Carousel.Item>
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
 * @description - Helper method for rendering a link to a developer or article
 * @param {Object} props
 * @param {String} props.label
 * @param {String} props.url
 * @returns {React.Component}
 */
function link({ label, url, key }) {
  return (
    <Link key={`${key}-link`}
        to={url}
      style={{
          textDecoration: 'none'
    }}>
    <div style={{
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div key={key} style={{
        background: 'rgba(238, 238, 238, 0.45)',
        color: '#333',
        transition: 'background 0.1s, color 0.1s',
        ':hover': {
          background: '#595959',
          color: '#f9f9f9',
          padding: '0px 10px 0px 10px',
          margin: '0px -10px 0px -10px',
        }
      }}>
        <ListGroupItem
          key={`${key}-listGroupItem`}
          style={{
            background: 'none',
        }}>
          {label}
      </ListGroupItem>
    </div></div></Link>
  );
}

link.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

/**
 * @description - Returns the main component to render a game's own
 * page
 * @param {Object} props
 * @returns {React.Component}
 */
class Game extends React.Component {
  static propTypes = {
    // this is derived state using selectors
    articles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })),
    cover: PropTypes.string,
    // this is derived state using selectors
    developers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
    // we don't currently use this right now, but we may in the future
    error: PropTypes.string, //eslint-disable-line
    name: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    release: PropTypes.string,
    // we don't currently use this right now, but we may in the future
    requested: PropTypes.bool, //eslint-disable-line
    screenshots: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })),
    summary: PropTypes.string,

    fetchGame: PropTypes.func.isRequired,
  };

  static defaultProps = {
    articles: [],
    cover: null,
    developers: [],
    error: null,
    genres: [],
    price: 13.37,
    name: '',
    // release defaults to today's date
    release: '',
    requested: false,
    screenshots: [{url: '', alt: ''}],
    summary: null,
  };

  /**
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchGame();
  }

  render() {
    const screenshots = this.props.screenshots ? this.props.screenshots : [];
    const coverURL = this.props.cover && this.props.cover.indexOf('http') < 0 ? `https://${this.props.cover}` : this.props.cover;
    const price = this.props.price ? `\$${this.props.price / 100}` : null;
    return (
      <div
        style={[
          GameStyles.main,
        ]}
      >
        <div style={[
            CommonAssets.stripeOverlay,
            CommonAssets.fillBackground,
          ]}
        />
        <div style={{
          position: 'fixed',
          top: '0',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: '-150',
          }}
        >
          <img
            src={coverURL}
            style={{
            width: '10%',
            height: '10%',
            imageRendering: 'pixelated',
            filter: 'saturate(250%) blur(2px)',
            display: 'block',
            position: 'relative',
            margin: 'auto',
            transform: 'perspective(800px) translate3d(0, 0, 760px) scale(2)',
            zIndex: '-5',
            }}
          />
        </div>
        <div style={{
          padding: '20px 2% 20px 2%'
        }}>
          <Jumbotron style={{
            padding: '2% 2% 2% 2%',
            margin: 'auto',
            maxWidth: '98%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px',
            backgroundColor: 'rgba(238, 238, 238, 0.8)'
          }}>

            <div style={{}}>
              <div style={{
                fontSize: 'calc(24px + 2.0vw)'
              }}>
                {this.props.name}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'calc(16px + 0.75vw)'
              }}>
                Released {this.props.release}
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <div style={{
                fontSize: 'calc(16px + 0.5vw)'
              }}>
                Genres:&nbsp;
              </div>
              <div style={{
                fontSize: 'calc(16px + 0.5vw)',
                display: 'flex',
                flexWrap: 'wrap'
              }}>
                {
                  this.props.genres.map((genre) => {
                    return (
                      <span key={genre}>
                        <Label key={`${genre}-label`}>
                          {genre}
                        </Label>
                        &nbsp;
                      </span>
                    )
                  })
                }
              </div>
            </div>
            <Carousel
              style={{
                margin: '2% -2% 2% -2%',
                width: '104%',
                backgroundColor: 'black',
                overflow: 'hidden',
              }}>
              <Carousel.Item>
                <a href={coverURL} style={{
                  display: 'flex',
                  width: '100%'
                }}>
                  <img
                    src={coverURL}
                    alt={this.props.name}
                    style={{
                      maxWidth: '96vw',
                      maxHeight: '50vh',
                      margin: 'auto'
                    }}
                  />
                </a>
              </Carousel.Item>
              {
                screenshots.map(_screenshot => screenshot(_screenshot))
              }
            </Carousel>

            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row'
              }}>
                <div style={{
                  fontSize: 'calc(14px + 0.5vw)'
                }}>
                  {price != null ? 'Price:' : ''}&nbsp;
                </div>
                <div style={{
                  fontSize: 'calc(14px + 0.5vw)',
                  color: '#00884b'
                }}>
                  {price != null ? `${price}` : 'Priceless'}
                </div>
              </div>
            </div>
            <hr style={{
               borderTop: '1px dotted #333333',
               opacity: '0.5',
               width: '100%',
            }} />
            <div>
              <div style={{
                fontSize: 'calc(16px + 0.75vw)'
              }}>
                Synoposis:
              </div>
              <div style={{overflow: 'hidden'}}>
                {ReactHTMLParser(this.props.summary)}
              </div>
            </div>
            <hr style={{
               borderTop: '1px dotted #333333',
               opacity: '0.5',
               width: '100%',
            }} />
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%'
              }}>
                <div style={{
                  fontSize: 'calc(16px + 0.75vw)'
                }}>
                  Developers:
                </div>
                <ListGroup style={{
                  maxHeight: '70vh',
                  overflow: 'scroll',
                  borderRadius: '4px'
                }}>
                  {
                    this.props.developers.map(developer => link({
                      label: developer.name,
                      url: `/developers/${developer.id}`,
                      key: `developer-${developer.id}`,
                    }))
                  }
                </ListGroup>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%'
              }}>
                <div style={{
                  fontSize: 'calc(16px + 0.75vw)'
                }}>
                  Articles:
                </div>
                <ListGroup style={{
                  maxHeight: '70vh',
                  overflow: 'scroll',
                  borderRadius: '4px'
                }}>
                  {
                    this.props.articles.map(article => link({
                      label: article.title,
                      url: `/articles/${article.id}`,
                      key: `article-${article.id}`,
                    }))
                  }
                </ListGroup>
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'calc(16px + 0.75vw)'
              }}>
                Twitter:
              </div>
              <p>Twitter is not available in your country.</p>
            </div>
            <div>
              <div style={{
                fontSize: 'calc(16px + 0.75vw)'
              }}>
                YouTube:
              </div>
              <p>This video is not available in your country.</p>
            </div>
            <div>
              <div style={{
                fontSize: 'calc(16px + 0.75vw)'
              }}>
                Twitch:
              </div>
              <p>Twitch is not available in your country.</p>
            </div>
          </Jumbotron>
        </div>
      </div>
    );
  }
}

export default Radium(Game);
