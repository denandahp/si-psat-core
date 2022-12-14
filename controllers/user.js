const authUtils = require('../controllers/utils/auth');
const config = require('../configs.json');
const debug = require('debug')('app:controller:user');
const user = require('../models/user.js');
const jwt = require('jsonwebtoken');

let refreshTokens = []

class UserController {
  async showAllUser (req, res) {
    let users = (await user.get()).rows;

    res.render('index', {
      users
    });
  }

  async login (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    try {
      let data = await user.login(username, password);
      let accessToken = jwt.sign({
        data
      }, config.secret, {
        expiresIn: 86400
      });
      let refreshToken = jwt.sign({
        data
      }, config.secret2, {
        expiresIn: 604800
      });
      refreshTokens.push(refreshToken);
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        maxAge: -1
      });
      if (data.status == '400') {res.status(400).json({ response: data });}
      else {
        res.status(200).json({
            response: data,
            accessToken,
            refreshToken
          });
      }
      
    } catch (e) {
      let errorResponse = authUtils.processLoginError(e);
      res.status(400).json(errorResponse);
    }
  } 

  async logout (req, res, next) {
    res.clearCookie('jwt');
    res.status(200).json({
      message: 'Cookie cleared'
    });
  }

  async register_superadmin(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.register_superadmin(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else if (detail.status == '401') {res.status(401).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }
  
  async register_pelaku_usaha(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.register_pelaku_usaha(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async register_auditor(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.register_auditor(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else if (detail.status == '401') {res.status(401).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async register_tim_komtek(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.register_tim_komtek(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else if (detail.status == '401') {res.status(401).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async update_pelaku_usaha(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.update_pelaku_usaha(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async update_superadmin(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.update_superadmin(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async update_auditor(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.update_auditor(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async update_tim_komtek(req, res, next) {
    let callback = async() => {
        try {
            let datas = req.body;
            debug('detail %o', datas);
            let detail = await user.update_tim_komtek(datas);
            if (detail.status == '400') {res.status(400).json({ response: detail });}
            else { res.status(200).json({ response: detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async index_sekretariat(req, res, next) {
    let callback = async() => {
        try {
            let id = req.query.user;
            let role = req.query.role;
            debug('detail %o', id);
            let detail = await user.index_sekretariat(id, role);
            if (detail.status == '400') {res.status(400).json({ detail });}
            else { res.status(200).json({ detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async detail_pelaku_usaha(req, res, next) {
    let callback = async() => {
        try {
            let id = req.query.user;
            debug('detail %o', id);
            let detail = await user.detail_pelaku_usaha(id);
            if (detail.status == '400') {res.status(400).json({ detail });}
            else { res.status(200).json({ detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async delete_sekretariat(req, res, next) {
    let callback = async() => {
        try {
            let id = req.query.user;
            let role = req.query.role;
            debug('detail %o', id);
            let detail = await user.delete_sekretariat(id, role);
            if (detail.status == '400') {res.status(400).json({ detail });}
            else { res.status(200).json({ detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async index_pelaku_usaha(req, res, next) {
    let callback = async() => {
        try {
            let id = req.query.user;
            let page = req.query.page;
            let limit = req.query.limit;
            debug('detail %o', id);
            let detail = await user.index_pelaku_usaha(id, page, limit);
            if (detail.status == '400') {res.status(400).json({ detail });}
            else { res.status(200).json({ detail });}
        } catch (e) {
            next(e.detail || e);
        }
    };
    let fallback = (err) => {
        next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }
}

module.exports = new UserController();