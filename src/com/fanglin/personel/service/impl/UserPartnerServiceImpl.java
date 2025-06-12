package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserPartnerDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserPartnerPO;
import com.fanglin.personel.service.UserPartnerService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserPartnerVO;

@Service("userPartnerService")
@Transactional(readOnly = true)
public class UserPartnerServiceImpl implements UserPartnerService {

	@Autowired
	private UserPartnerDao userPartnerDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<UserPartnerVO> queryUserPartner(UserPartnerVO userPartnerVO) throws FLException {

		List<UserPartnerPO> userPartnerPOs = userPartnerDao.queryUserPartner(userPartnerVO.getUid());
		List<UserPartnerVO> userPartnerVOs = new ArrayList<UserPartnerVO>();

		for (UserPartnerPO userPartnerPO : userPartnerPOs) {
			userPartnerVOs.add(userPartnerPO.ptv(new UserPartnerVO(new UserBaseVO())));
		}

		return userPartnerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserPartner(UserPartnerVO userPartnerVO, int company) throws FLException {

		UserPartnerPO userPartnerPO = new UserPartnerPO();

		UserPO userPO = userDao.queryUserByUserId(userPartnerVO.getPartner().getUserId());

		userPartnerPO.setUid(userPartnerVO.getUid());
		userPartnerPO.setPartner(userPO);
		userPartnerPO.setType(userPartnerVO.getType());
		userPartnerPO.setStatus(UserPartnerPO.STATUS_VALID_INT);
		userPartnerPO.setCompany(company);

		userPartnerDao.save(userPartnerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteUserPartner(UserPartnerVO userPartnerVO) throws FLException {

		UserPartnerPO userPartnerPO = userPartnerDao.get(userPartnerVO.getUpid());

		userPartnerDao.delete(userPartnerPO);

		return 0;
	}

}
