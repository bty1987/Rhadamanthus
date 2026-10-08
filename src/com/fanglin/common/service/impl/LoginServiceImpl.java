/**
 * @File Name		: LoginServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2017-8-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fanglin.common.service.LoginService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.factory.dao.TokenDao;
import com.fanglin.factory.po.TokenPO;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserCompanyPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SystemConfig;

@Service("loginService")
@Transactional(readOnly = true)
public class LoginServiceImpl implements LoginService {

	private static final Logger logger = LoggerFactory.getLogger(LoginServiceImpl.class);

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserCompanyDao userCompanyDao;

	@Autowired
	private TokenDao tokenDao;

	@Autowired
	private UserDao userDao;

	@Override
	public String requestAuthCode(String userId, String code, String secret) throws FLException {

		try {

			TokenPO tokenPO = tokenDao.queryTokenByKey(code);

			if (tokenPO == null) {
				throw new FLException(110008, "验证信息错误");
			}

			if (code == null || secret == null || !code.equals(AESHelper.decrypt(secret, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
				throw new FLException(110008, "验证信息错误");
			}

			Authentication authentication = null;

			int $company = 0;

			UserPO userPO = userDao.queryUserByUserId(userId);

			if (userPO == null) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			// 关联校验: buid>0 时换票 uid 必须与之相等(按110008拒绝,不泄露关联关系)
			if (tokenPO.getBuid() > 0 && tokenPO.getBuid() != userPO.getUid()) {
				throw new FLException(110008, "验证信息错误");
			}

			$company = userPO.getCompany();

			authentication = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), true, $company, userPO.getFreedom());

			// 加固: 超时档位按码配置(0=正常超时,-1=永久映射TIMEOUT_INT);原 setTimout(1) 一律永久
			authentication.setTimout(tokenPO.getTimeout() == -1 ? Authentication.TIMEOUT_INT : (short) 0);

			return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}
	}

	@Override
	public String phoneAuthCode(String userId, String phone, String code, String secret) throws FLException {

		try {

			try {
				if (!code.equals(AESHelper.decrypt(secret, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
					throw new FLException(330010, "验证码错误");
				}
			} catch (Exception e) {
				throw new FLException(330010, "验证码错误");
			}

			Authentication authentication = null;

			int $company = 0;

			UserPO userPO = userDao.queryUserByUserId(userId);

			if (userPO == null) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			if (phone != null && !phone.equals(userPO.getPhone())) {
				throw new FLException(110021, "电话不匹配");
			}

			$company = userPO.getCompany();

			authentication = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), true, $company, userPO.getFreedom());

			// 加固: 强制正常超时,同 requestAuthCode
			authentication.setTimout((short) 0);

			return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}
	}

	public static void main(String[] args) {

	}

	@Override
	public String changeAuthCode(String auth, String company) throws FLException {

		try {
			Authentication authentication = new Authentication(AESHelper.decrypt(auth, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));

			CompanyPO companyPO = companyDao.get(FormatUtil.decodeCompany(AESHelper.decrypt(company, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"))));

			if (companyPO == null) {
				throw new FLException(110011, "无权限登陆");
			}

			UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

			if (userPO == null) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			UserCompanyPO userCompanyPO = userCompanyDao.queryUserCompany(userPO.getUid(), companyPO.getCid());

			if (userCompanyPO == null) {
				throw new FLException(110011, "无权限登陆");
			}

			authentication.setCompany(companyPO.getCid());

			return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("切换认证码失败", e);
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}

	}

	@Override
	public String updateAuthCode(String auth, String password) throws FLException {

		try {
			Authentication authentication = new Authentication(AESHelper.decrypt(auth, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));

			UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

			if (userPO == null) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			if (!userPO.getPassword().equals(MD5Helper.MD5(password)) || userPO.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(110011, "无权限登陆");
			}

			authentication.setUpdateTime(new Date().getTime());

			return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}
	}

}
