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
	public List<UserPartnerVO> queryUserPartner(UserPartnerVO userPartnerVO, int company) throws FLException {

		List<UserPartnerPO> userPartnerPOs = userPartnerVO.getType() == null ? userPartnerDao.queryUserPartner(userPartnerVO.getUid()) : userPartnerDao.queryUserPartnerByUid(userPartnerVO.getUid(), userPartnerVO.getType(), company);

		List<UserPartnerVO> userPartnerVOs = new ArrayList<UserPartnerVO>();

		for (UserPartnerPO userPartnerPO : userPartnerPOs) {
			userPartnerVOs.add(userPartnerPO.ptv(new UserPartnerVO(new UserBaseVO())));
		}

		return userPartnerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserPartner(UserPartnerVO userPartnerVO, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userPartnerVO.getPartner().getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		// 厂商关联用户(type=5)唯一归属: 一个用户仅可归属一个厂商, 重复添加或跨厂商添加均拦截
		if (userPartnerVO.getType() != null && userPartnerVO.getType() == UserPartnerPO.TYPE_SUPPLIER_INT) {

			UserPartnerPO existPO = userPartnerDao.queryUserPartnerByPuid(userPO.getUid(), UserPartnerPO.TYPE_SUPPLIER_INT, company);

			if (existPO != null) {

				if (existPO.getUid() == userPartnerVO.getUid()) {
					throw new FLException(190015, "该用户已关联该厂商");
				}

				throw new FLException(190016, "该用户已关联其他厂商");
			}
		}

		UserPartnerPO userPartnerPO = new UserPartnerPO();
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
