package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalancePictureDao;
import com.fanglin.balance.po.BalancePicturePO;
import com.fanglin.balance.service.BalancePictureService;
import com.fanglin.balance.vo.BalancePictureVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("balancePictureService")
@Transactional(readOnly = true)
public class BalancePictureServiceImpl implements BalancePictureService {

	@Autowired
	private BalancePictureDao balancePictureDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<BalancePictureVO> queryBalancePicture(com.fanglin.balance.vo.BalancePictureVO balancePictureVO) {

		List<BalancePicturePO> balancePicturePOs = balancePictureVO.getPid() != null ? balancePictureDao.queryBalancePictureByPid(balancePictureVO.getPid()) : balancePictureDao.queryBalancePictureByBid(balancePictureVO.getBid());
		List<BalancePictureVO> balancePictureVOs = new ArrayList<BalancePictureVO>();

		for (BalancePicturePO balancePicturePO : balancePicturePOs) {
			balancePictureVOs.add(balancePicturePO.ptv(new BalancePictureVO(new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		return balancePictureVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBalancePicture(BalancePictureVO balancePictureVO, String userId, int company) throws FLException {

		SystemConfigPO limit = systemConfigDao.querySystemConfig("BALANCE_PICTURE_LIMIT", company);

		if (balancePictureDao.countBalancePicture(balancePictureVO.getPid(), balancePictureVO.getType()) > (limit == null ? 4 : Integer.parseInt(limit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		BalancePicturePO balancePicturePO = new BalancePicturePO();

		BeanUtil.copyPropertie(balancePictureVO, balancePicturePO, Arrays.asList("creater"));

		balancePicturePO.setCreater(creater);
		balancePicturePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		balancePictureDao.save(balancePicturePO);

		balancePictureVO.setBpid(balancePicturePO.getBpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteBalancePicture(BalancePictureVO balancePicture) {

		BalancePicturePO balancePicturePO = balancePictureDao.get(balancePicture.getBpid());

		balancePicturePO.setStatus(BalancePicturePO.STATUS_DEL_SHORT);

		balancePictureDao.update(balancePicturePO);

		return 0;
	}

}
