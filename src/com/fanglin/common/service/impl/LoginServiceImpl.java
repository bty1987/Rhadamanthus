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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.TokenDao;
import com.fanglin.common.po.TokenPO;
import com.fanglin.common.service.LoginService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserCompanyPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;

@Service("loginService")
@Transactional(readOnly=true)
public class LoginServiceImpl implements LoginService {
	
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
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
			
			if(tokenPO == null){
				throw new FLException(110008, "验证信息错误");
			}
			
			if(code == null || secret == null || !code.equals(AESHelper.decryptString(secret, SystemConfig.getString("encryptKey")))){
				throw new FLException(110008, "验证信息错误");
			}
			
			Authentication authentication = null;

			int $company = 0;
			
			UserPO userPO = userDao.queryUserByUserId(userId);
			
			if(userPO == null){
				throw new FLException(110004, "该用户不能登陆系统");
			}
			
			$company = userPO.getCompany();
			
			authentication = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), true, $company, userPO.getFreedom());
			authentication.setTimout((short) 1);
			
			return AESHelper.encryptToString(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"));
		} catch (FLException e) {
			throw e;
		}  catch (Exception e) {
			LogUtils.logging(logger, e, "requestAuthCode");
			throw new FLException(110000, "系统处理问题");
		}
		
	}

	@Override
	public String changeAuthCode(String auth, String company) throws FLException {
		
		try {
			Authentication authentication = new Authentication(AESHelper.decryptString(auth, SystemConfig.getString("encryptKey")));
			
			CompanyPO companyPO = companyDao.get(FormatUtil.decodeCompany(AESHelper.decryptString(company, SystemConfig.getString("encryptKey"))));
			
			if(companyPO == null){
				throw new FLException(110011, "无权限登陆");
			}
			
			UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
			
			if(userPO == null){
				throw new FLException(110004, "该用户不能登陆系统");
			}
			
			UserCompanyPO userCompanyPO = userCompanyDao.queryUserCompany(userPO.getUid(), companyPO.getCid());
			
			if(userCompanyPO == null){
				throw new FLException(110011, "无权限登陆");
			}
			
			authentication.setCompany(companyPO.getCid());
			
			return AESHelper.encryptToString(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"));
			
		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			LogUtils.logging(logger, e, "changeAuthCode");
			throw new FLException(110000, "系统处理问题");
		}
		
	}

	@Override
	public String updateAuthCode(String auth, String password) throws FLException {
		
		try {
			Authentication authentication = new Authentication(AESHelper.decryptString(auth, SystemConfig.getString("encryptKey")));
			
			UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
			
			if(userPO == null){
				throw new FLException(110004, "该用户不能登陆系统");
			}
			
			if(!userPO.getPassword().equals(MD5Helper.MD5(password)) || userPO.getStatus() == UserPO.STATUS_DISABLE_INT){
				throw new FLException(110011, "无权限登陆");
			}
			
			authentication.setUpdateTime(new Date().getTime());
			
			return AESHelper.encryptToString(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"));
		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			LogUtils.logging(logger, e, "updateAuthCode");
			throw new FLException(110000, "系统处理问题");
		}
	}

}
