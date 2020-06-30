import PropTypes from 'prop-types';

/**
 * 条件渲染
 */
const RenderIf = props => {
  if (props.condition) {
    return props.children;
  }
  return props.empty;
};

RenderIf.propTypes = {
  condition: PropTypes.bool,
  empty: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};
RenderIf.defaultProps = {
  condition: false,
  empty: null,
};

export default RenderIf;
