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

package com.fanglin.common.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.LoginInfoDao;
import com.fanglin.common.po.LoginInfoPO;
import com.fanglin.common.service.LoginInfoService;
import com.fanglin.common.vo.LoginInfoVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.AuthenticationUtil;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

@Service("loginInfoService")
@Transactional(readOnly=true)
public class LoginInfoServiceImpl implements LoginInfoService {
	
	@Autowired
	private LoginInfoDao loginInfoDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public LoginInfoVO queryLoginInfoByLoginFlag(LoginInfoVO loginInfoVO) {
		
		LoginInfoPO loginInfoPO = loginInfoDao.queryLoginInfoByLoginFlag(loginInfoVO.getLoginFlag());
		
		if(loginInfoPO != null){
			BeanUtil.copyProperties(loginInfoPO, loginInfoVO);
		}
		
		return loginInfoVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public LoginInfoVO addLoginInfo() {
		
		LoginInfoVO loginInfoVO = new LoginInfoVO();
		LoginInfoPO loginInfoPO = new LoginInfoPO(UUIDUtil.getUuid(), -1, "", "", new Date().getTime());
		
		loginInfoDao.save(loginInfoPO);
		
		loginInfoVO.setLoginFlag(loginInfoPO.getLoginFlag());
		
		return loginInfoVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateLoginInfoForAuthentication(LoginInfoVO loginInfoVO) throws FLException {
		
		UserPO userPO = userDao.get(loginInfoVO.getUserId());
		
		if(userPO == null){
			throw new FLException(110004, "该用户不能登陆系统");
		}
		
		System.out.println(loginInfoVO.getX());
		System.out.println(loginInfoVO.getY());
		
		Double x = loginInfoVO.getX();
		Double y = loginInfoVO.getY();
		
		if(x == null || y == null){
			throw new FLException(110007, "网络问题");
		}
		
		if(userPO.getExtranet() == 0){
			boolean checkFlag = false;
			
			String checkPoint = SystemConfig.getString("checkPoint");
			double checkRang = SystemConfig.getDouble("checkRang");
			
			String[] checkInfos = checkPoint.split(",");
			
			for(String checkInfo: checkInfos){
				double _x = Double.parseDouble(checkInfo.split(":")[0]);
				double _y = Double.parseDouble(checkInfo.split(":")[1]);
				
				if(Math.abs(x - _x) < checkRang && Math.abs(y - _y) < checkRang){
					checkFlag = true;
					break;
				}
			}
			
			if(!checkFlag){
				throw new FLException(110007, "网络问题");
			}
		}
		
		LoginInfoPO loginInfoPO = loginInfoDao.queryLoginInfoByLoginFlag(loginInfoVO.getLoginFlag());
		
		if(loginInfoPO != null){
			loginInfoPO.setAuthentication(loginInfoVO.getAuthentication());
			loginInfoPO.setCode(0);
			loginInfoPO.setX(x);
			loginInfoPO.setY(y);
			
			loginInfoDao.update(loginInfoPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int login(LoginInfoVO loginInfoVO) {
		
		LoginInfoPO loginInfoPO = loginInfoDao.queryLoginInfoByLoginFlag(loginInfoVO.getLoginFlag());
		
		if(loginInfoPO != null){
			
			String userId = loginInfoVO.getUserId();
			
			LoginLogVO loginLogVO = new LoginLogVO();
			loginLogVO.setLoginId(userId);
			loginLogVO.setSourceIp("ding");
			loginLogVO.setLoginTime(DateUtil.getDateToTimestamp(new Date()));
			
			UserPO userPO = userDao.get(userId);
			
			if(userPO != null){
				if((userPO.getIsLogin() & UserPO.ISLOGIN_FIP_INT) == UserPO.ISLOGIN_FIP_INT){
					AuthenticationUtil authenticationUtil = new AuthenticationUtil(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRoleId(), (new Date()).getTime(), false);
					
					try {
						String authentication = AESHelper.encryptToString(authenticationUtil.getAuthenticationStr(), SystemConfig.getString("encryptKey"));
						
						loginInfoPO.setAuthentication(authentication);
						loginInfoPO.setCode(0);
					} catch (Exception e) {
						loginInfoPO.setCode(110007);
						loginInfoPO.setMessage("网络问题");
					}
			    }else{
			    	loginInfoPO.setCode(110004);
					loginInfoPO.setMessage("该用户不能登陆系统");
			    }
			}else{
				loginInfoPO.setCode(110006);
				loginInfoPO.setMessage("用户名或者密码错误");
			}
			
			loginInfoDao.update(loginInfoPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteLoginInfoByOptime(LoginInfoVO loginInfoVO) {
		
		loginInfoDao.deleteLoginInfoByOptime(new Date().getTime());
		
		return 0;
	}
	
}
