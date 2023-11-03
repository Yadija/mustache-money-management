import { web } from './application/web';
import { logger } from './application/logging';

const port = 3000;

web.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
