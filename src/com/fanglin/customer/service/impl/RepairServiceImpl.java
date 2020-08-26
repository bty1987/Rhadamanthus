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
import com.fanglin.customer.dao.RepairDao;
import com.fanglin.customer.po.AepairPO;
import com.fanglin.customer.po.RepairPO;
import com.fanglin.customer.service.RepairService;
import com.fanglin.customer.vo.RepairVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("repairService")
@Transactional(readOnly = true)
public class RepairServiceImpl implements RepairService {
	
	@Autowired
	private RepairDao repairDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private AepairDao aepairDao;

	@Override
	public List<RepairVO> queryRepair(RepairVO repairVO) {
		
		List<RepairPO> repairPOs = repairDao.queryRepair(repairVO.getAid());
		List<RepairVO> repairVOs = new ArrayList<RepairVO>();
		
		for(RepairPO repairPO : repairPOs){
			
			repairVO = new RepairVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(repairPO, repairVO, Arrays.asList("creater", "updater", "deliver", "repaier"));
			
			repairVO.getCreater().setBaseInfo(repairPO.getCreater());
			repairVO.getUpdater().setBaseInfo(repairPO.getUpdater());
			repairVO.getRepaier().setBaseInfo(repairPO.getRepaier());
			repairVO.getDeliver().setBaseInfo(repairPO.getDeliver());
			
			repairVOs.add(repairVO);
			
		}
		
		return repairVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRepair(RepairVO repairVO, String userId) {
		
		UserPO userPO = userDao.queryUserByUserId(repairVO.getRepaier().getUserId());
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		RepairPO repairPO = new RepairPO().init(repairVO.getAid(), creater, userPO, repairVO.getContent());
		
		repairDao.save(repairPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int keepRepair(RepairVO repairVO, String userId) throws FLException {
		
		RepairPO repairPO = repairDao.get(repairVO.getRid());
		
		if (repairPO == null) {
			throw new FLException(330025, "维修信息不存在");
		}
		
		if (repairPO.getStatus() != RepairPO.STATUS_INIT_INT) {
			throw new FLException(330026, "维修状态不可操作");
		}
		
		UserPO updater = userDao.queryUserByUserId(userId);
		
		repairPO.setUpdater(updater);
		repairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		
		AepairPO aepairPO = aepairDao.get(repairPO.getAid());
		
		switch (repairVO.getSchedule().intValue()) {

		case AepairPO.ONESTATE_SHUI_INT:
			aepairPO.setOnestate(AepairPO.STATUS_REPAIR_INT);
			break;
		case AepairPO.TWOSTATE_DIAN_INT:
			aepairPO.setTwostate(AepairPO.STATUS_REPAIR_INT);
			break;
		case AepairPO.THRSTATE_WA_INT:
			aepairPO.setThrstate(AepairPO.STATUS_REPAIR_INT);
			break;
		case AepairPO.FORSTATE_MU_INT:
			aepairPO.setForstate(AepairPO.STATUS_REPAIR_INT);
			break;
		case AepairPO.FIVSTATE_YOU_INT:
			aepairPO.setFivstate(AepairPO.STATUS_REPAIR_INT);
			break;
		default:
			break;
		}
		
		aepairPO.setStatus(AepairPO.STATUS_REPAIR_INT);
		aepairDao.update(aepairPO);
		
		repairPO.setStatus(RepairPO.STATUS_REPAIR_INT);
		repairDao.update(repairPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishRepair(RepairVO repairVO, String userId) throws FLException {

		RepairPO repairPO = repairDao.get(repairVO.getRid());
		
		if (repairPO == null) {
			throw new FLException(330025, "维修信息不存在");
		}
		
		if (repairPO.getStatus() != RepairPO.STATUS_REPAIR_INT) {
			throw new FLException(330026, "维修状态不可操作");
		}
		
		UserPO updater = userDao.queryUserByUserId(userId);
		
		if (!updater.getUserId().equals(repairPO.getRepaier().getUserId())) {
			throw new FLException(330028, "维修非当前归属");
		}
		
		AepairPO aepairPO = aepairDao.get(repairPO.getAid());
		
		switch (repairVO.getSchedule().intValue()) {

		case AepairPO.ONESTATE_SHUI_INT:
			aepairPO.setOnestate(AepairPO.STATUS_FINISH_INT);
			break;
		case AepairPO.TWOSTATE_DIAN_INT:
			aepairPO.setTwostate(AepairPO.STATUS_FINISH_INT);
			break;
		case AepairPO.THRSTATE_WA_INT:
			aepairPO.setThrstate(AepairPO.STATUS_FINISH_INT);
			break;
		case AepairPO.FORSTATE_MU_INT:
			aepairPO.setForstate(AepairPO.STATUS_FINISH_INT);
			break;
		case AepairPO.FIVSTATE_YOU_INT:
			aepairPO.setFivstate(AepairPO.STATUS_FINISH_INT);
			break;
		default:
			break;
		}
		
		aepairPO.setStatus(AepairPO.STATUS_INIT_INT);
		aepairDao.update(aepairPO);
		
		repairPO.setUpdater(updater);
		repairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		repairPO.setStatus(RepairPO.STATUS_FINISH_INT);
		repairPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		repairDao.update(repairPO);
		
		return 0;
	}

}
