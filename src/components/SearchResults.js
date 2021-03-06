import React from 'react';
import PropTypes from 'prop-types';
import Radium, { StyleRoot } from 'radium';
import Highlighter from 'react-highlight-words';
import InstanceDetailsStyles from './instance-details/InstanceDetailsStyles';
import Minigrid from './minigrid/Minigrid';
import Minicard from './minicard/Minicard';
import ExternalMinicard from './minicard/ExternalMinicard';
import CommonAssets from './CommonAssets';
import InstanceDetails from './instance-details/InstanceDetails';

/**
 * @description - Helper method for rendering a link to a game, developer, or article
 * @param {Object} props
 * @param {String} props.label
 * @param {String} props.url
 * @returns {React.Component}
 */
function link({
  label, url, cover, key,
}) {
  return (
    <Minicard label={label} url={url} cover={cover} cardKey={`${key}-inner`} key={key} />
  );
}

link.propTypes = {
  label: PropTypes.object.isRequired,//eslint-disable-line
  url: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

/**
 * @description - Helper method for rendering a link to an external source
 * @param {Object} props
 * @param {String} props.label
 * @param {String} props.url
 * @returns {React.Component}
 */
function exLink({
  label, url, cover, key,
}) {
  return (
    <ExternalMinicard label={label} url={url} cover={cover} cardKey={`${key}-inner`} key={key} />
  );
}

exLink.propTypes = {
  label: PropTypes.object.isRequired,//eslint-disable-line
  url: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query_string: escape(decodeURI(window.location.href.substring(window.location.href.lastIndexOf('?q=') + 3))).split('%20').join(' '),//eslint-disable-line
      game_results: {},
      developer_results: {},
      article_results: {},
      video_results: {},
      // tweet_results {},
    };
    this.updateGameItems = this.updateGameItems.bind(this);
    this.updateDeveloperItems = this.updateDeveloperItems.bind(this);
    this.updateArticleItems = this.updateArticleItems.bind(this);
    this.updateVideoItems = this.updateVideoItems.bind(this);
    this.updateGameItems();
    this.updateDeveloperItems();
    this.updateArticleItems();
    this.updateVideoItems();
  }

  /**
   * @description - Lifecycle method invoked immediately after updating occurs. Updates models.
   */
  componentDidUpdate() {
    const newString = escape(decodeURI(window.location.href.substring(window.location.href.lastIndexOf('?q=') + 3))).split('%20').join(' ');//eslint-disable-line
    if (newString !== this.state.query_string) {
      this.state.query_string = newString;
      this.updateGameItems();
      this.updateDeveloperItems();
      this.updateArticleItems();
      this.updateVideoItems();
    }
  }

  /**
   * @description - Fetches games similar in name, summary, website, genre(s), platform(s),
   * or developer(s) to the query from the API.
   */
  updateGameItems() {
    fetch(//eslint-disable-line
      encodeURI(`${process.env.API_HOST}/v1/grid/game?q={"filters":[{"or":[{"name":"c_name","op":"like","val":"%${this.state.query_string}%"},`
        .concat(`{"name":"summary","op":"like","val":"%20${this.state.query_string}%20"},{"name":"website","op":"like","val":"%${this.state.query_string}%"},`)
        .concat(`{"name":"genres__name","op":"any","val":"${this.state.query_string}"},{"name":"platforms__name","op":"any","val":"${this.state.query_string}"},`)
        .concat(`{"name":"developers__c_name","op":"any","val":"${this.state.query_string}"}]}],"order_by":[{"field":"vindex","direction":"desc"}]}&results_per_page=100`)),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ game_results: data });
      });
  }

  /**
   * @description - Fetches developers similar in name, website, twitter, or game(s) to the query
   * from the API.
   */
  updateDeveloperItems() {
    fetch(//eslint-disable-line
      encodeURI(`${process.env.API_HOST}/v1/grid/developer?q={"filters":[{"or":[{"name":"name","op":"like","val":"%${this.state.query_string}%"},`
        .concat(`{"name":"website","op":"like","val":"%${this.state.query_string}%"},{"name":"twitter","op":"like","val":"%${this.state.query_string}%"},`)
        .concat(`{"name":"games__c_name","op":"any","val":"${this.state.query_string}"}]}],"order_by":[{"field":"name","direction":"asc"}]}&results_per_page=100`)),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ developer_results: data });
      });
  }

  /**
   * @description - Fetches articles similar in title, introduction, outlet, author, game(s), or
   * developer(s) to the query from the API.
   */
  updateArticleItems() {
    fetch(//eslint-disable-line
      encodeURI(`${process.env.API_HOST}/v1/grid/article?q={"filters":[{"or":[{"name":"title","op":"like","val":"%${this.state.query_string}%"},`
        .concat(`{"name":"introduction","op":"like","val":"%20${this.state.query_string}%20"},{"name":"outlet","op":"like","val":"%${this.state.query_string}%"},`)
        .concat(`{"name":"author","op":"like","val":"%${this.state.query_string}%"},{"name":"games__c_name","op":"any","val":"${this.state.query_string}"},`)
        .concat(`{"name":"developers__c_name","op":"any","val":"${this.state.query_string}"}]}],"order_by":[{"field":"title","direction":"asc"}]}&results_per_page=100`)),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ article_results: data });
      });
  }

  /**
   * @description - Fetches videos similar in name to the query string from the API.
   */
  updateVideoItems() {
    fetch(//eslint-disable-line
      encodeURI(`${process.env.API_HOST}/v1/video?q={"filters":[{"name":"name","op":"like","val":"%${this.state.query_string}%"}],"order_by":[{"field":"name","direction":"asc"}]}&results_per_page=100`),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ video_results: data });
      });
  }

  render() {
    const query = this.state.query_string || '';
    const searchWords = query ? query.split(' ') : [];
    return (
      <StyleRoot>
        <div>
          <div style={[
            CommonAssets.fillBackground,
            CommonAssets.horizontalGradient,
          ]}
          />
          <div style={[
            CommonAssets.stripeOverlay,
            CommonAssets.fillBackground,
          ]}
          />
          <InstanceDetails>
            <div style={[InstanceDetailsStyles.externalGridCluster]}>
              <div style={[InstanceDetailsStyles.gameGridCluster('45%')]}>
                <div style={[InstanceDetailsStyles.gameIndicator]}>
                  {this.state.game_results.num_results} Game Results:
                </div>
                <Minigrid>
                  {
                    this.state.game_results.objects ?
                    this.state.game_results.objects.map(game => link({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f', color: '#000' }}
                        highlightTag="span"
                        searchWords={searchWords}
                        textToHighlight={game.name}
                      />,
                      url: `/games/${game.game_id}`,
                      cover: (game.cover && game.cover.indexOf('http') < 0 ? `https://${game.cover}` : game.cover),
                      key: `game-${game.game_id}`,
                    })) : ['Loading games']
                  }
                  {
                    this.state.game_results.num_results > 100 ?
                    link({
                      label: 'For more results, visit our games page',
                      url: '/games',
                      key: 'game-default',
                    }) : null
                  }
                </Minigrid>
              </div>
              <div style={[InstanceDetailsStyles.developerGridCluster('45%')]}>
                <div style={[InstanceDetailsStyles.developerIndicator]}>
                  {this.state.developer_results.num_results} Developer Results:
                </div>
                <Minigrid>
                  {
                    this.state.developer_results.objects ?
                    this.state.developer_results.objects.map(developer => link({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f', color: '#000' }}
                        highlightTag="span"
                        searchWords={searchWords}
                        textToHighlight={developer.name}
                      />,
                      url: `/developers/${developer.developer_id}`,
                      cover: (developer.logo && developer.logo.indexOf('http') < 0 ? `https://${developer.logo}` : developer.logo),
                      key: `developer-${developer.developer_id}`,
                    })) : ['Loading developers']
                  }
                  {
                    this.state.developer_results.num_results > 100 ?
                    link({
                      label: 'For more results, visit our developers page',
                      url: '/developers',
                      key: 'developer-default',
                    }) : null
                  }
                </Minigrid>
              </div>
              <div style={[InstanceDetailsStyles.articleGridCluster('45%')]}>
                <div style={[InstanceDetailsStyles.articleIndicator]}>
                  {this.state.article_results.num_results} Article Results:
                </div>
                <Minigrid>
                  {
                    this.state.article_results.objects ?
                    this.state.article_results.objects.map(article => link({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f', color: '#000' }}
                        highlightTag="span"
                        searchWords={searchWords}
                        textToHighlight={article.title}
                      />,
                      url: `/articles/${article.article_id}`,
                      cover: article.cover,
                      key: `article-${article.article_id}`,
                    })) : ['Loading articles']
                  }
                  {
                    this.state.article_results.num_results > 100 ?
                    link({
                      label: 'For more results, visit our articles page',
                      url: '/articles',
                      key: 'article-default',
                    }) : null
                  }
                </Minigrid>
              </div>
              <div style={[InstanceDetailsStyles.videoGridCluster('45%')]}>
                <div style={[InstanceDetailsStyles.videoIndicator]}>
                  {this.state.video_results.num_results} Video Results:
                </div>
                <Minigrid>
                  {
                    this.state.video_results.objects ?
                    this.state.video_results.objects.map(video => exLink({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f', color: '#000' }}
                        highlightTag="span"
                        searchWords={searchWords}
                        textToHighlight={video.name}
                      />,
                      url: `${video.video_link}`,
                      cover: video.thumbnail,
                      key: `video-${video.video_id}`,
                    })) : ['Loading videos']
                  }
                </Minigrid>
              </div>
            </div>
          </InstanceDetails>
        </div>
      </StyleRoot>
    );
  }
}

export default Radium(SearchResults);
