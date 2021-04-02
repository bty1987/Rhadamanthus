/**
 * @File Name		: LoginInfoServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.LoginInfoVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.factory.dao.LoginInfoDao;
import com.fanglin.factory.po.LoginInfoPO;
import com.fanglin.factory.service.LoginInfoService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

@Service("loginInfoService")
@Transactional(readOnly = true)
public class LoginInfoServiceImpl implements LoginInfoService {

	@Autowired
	private LoginInfoDao loginInfoDao;

	@Autowired
	private UserDao userDao;

	@Override
	public LoginInfoVO queryLoginInfoByLoginFlag(LoginInfoVO loginInfoVO) {

		LoginInfoPO loginInfoPO = loginInfoDao.queryLoginInfoByLoginFlag(loginInfoVO.getLoginFlag());

		if (loginInfoPO != null) {
			BeanUtil.copyProperties(loginInfoPO, loginInfoVO);
		}

		return loginInfoVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public LoginInfoVO addLoginInfo() throws FLException {

		LoginInfoVO loginInfoVO = new LoginInfoVO();
		LoginInfoPO loginInfoPO = new LoginInfoPO(UUIDUtil.getUuid(), -1, "", "", new Date().getTime());

		loginInfoDao.save(loginInfoPO);

		loginInfoVO.setLoginFlag(loginInfoPO.getLoginFlag());

		return loginInfoVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateLoginInfoForAuthentication(LoginInfoVO loginInfoVO) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(loginInfoVO.getUserId());

		if (userPO == null) {
			throw new FLException(110004, "该用户不能登陆系统");
		}

		if ((userPO.getExtranet() & UserPO.EXTRANET_QCODE_INT) != UserPO.EXTRANET_QCODE_INT) {
			throw new FLException(110004, "该用户不能登陆系统");
		}

		LoginInfoPO loginInfoPO = loginInfoDao.queryLoginInfoByLoginFlag(loginInfoVO.getLoginFlag());

		if (loginInfoPO != null) {
			loginInfoPO.setAuthentication(loginInfoVO.getAuthentication());
			loginInfoPO.setCode(0);
			loginInfoPO.setX(0);
			loginInfoPO.setY(0);

			loginInfoDao.update(loginInfoPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int login(LoginInfoVO loginInfoVO) {

		LoginInfoPO loginInfoPO = loginInfoDao.queryLoginInfoByLoginFlag(loginInfoVO.getLoginFlag());

		if (loginInfoPO != null) {

			String userId = loginInfoVO.getUserId();

			UserPO userPO = userDao.queryUserByUserId(userId);

			if (userPO != null) {
				if (userPO.getIsLogin() != 0) {
					Authentication authenticationUtil = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), false, userPO.getCompany(), userPO.getFreedom());

					try {
						String authentication = AESHelper.encrypt(authenticationUtil.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

						loginInfoPO.setAuthentication(authentication);
						loginInfoPO.setCode(0);
					} catch (Exception e) {
						loginInfoPO.setCode(110007);
						loginInfoPO.setMessage("网络问题");
					}
				} else {
					loginInfoPO.setCode(110004);
					loginInfoPO.setMessage("该用户不能登陆系统");
				}
			} else {
				loginInfoPO.setCode(110006);
				loginInfoPO.setMessage("用户名或者密码错误");
			}

			loginInfoDao.update(loginInfoPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteLoginInfoByOptime(LoginInfoVO loginInfoVO) {

		loginInfoDao.deleteLoginInfoByOptime(new Date().getTime());

		return 0;
	}

}
