package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.AepairDao;
import com.fanglin.customer.dao.RepairpayDao;
import com.fanglin.customer.po.AepairPO;
import com.fanglin.customer.po.RepairpayPO;
import com.fanglin.customer.service.RepairpayService;
import com.fanglin.customer.vo.RepairpayVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("repairpayService")
@Transactional(readOnly = true)
public class RepairpayServiceImpl implements RepairpayService {

	@Autowired
	private RepairpayDao repairpayDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AepairDao aepairDao;

	@Override
	public List<RepairpayVO> queryRepairpay(RepairpayVO repairpayVO) {

		List<RepairpayPO> repairpayPOs = repairpayDao.queryRepairpay(repairpayVO.getAid());
		List<RepairpayVO> repairpayVOs = new ArrayList<RepairpayVO>();

		for (RepairpayPO repairpayPO : repairpayPOs) {

			repairpayVO = new RepairpayVO(new UserBaseVO());

			BeanUtil.copyProperties(repairpayPO, repairpayVO, Arrays.asList("creater"));
			
			repairpayVO.getCreater().setBaseInfo(repairpayPO.getCreater());

			repairpayVOs.add(repairpayVO);
		}

		return repairpayVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRepairpay(RepairpayVO repairpayVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(repairpayVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330025, "维修信息不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		RepairpayPO repairpayPO = new RepairpayPO();

		BeanUtil.copyProperties(repairpayVO, repairpayPO);

		repairpayPO.setCreater(userPO);
		repairpayPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		repairpayDao.save(repairpayPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRepairpay(RepairpayVO repairpayVO) throws FLException {

		RepairpayPO repairpayPO = repairpayDao.get(repairpayVO.getRpid());

		if (repairpayPO == null) {
			throw new FLException(330032, "维修款不存在");
		}

		if (repairpayPO.getStatus() != RepairpayPO.STATUS_INIT_INT) {
			throw new FLException(330033, "维修款状态不可操作");
		}

		repairpayDao.delete(repairpayPO);

		return 0;
	}

}
