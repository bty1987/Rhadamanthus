package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.dao.AuditRecordDao;
import com.fanglin.decoration.dao.AuditScaleDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.po.AuditRecordPO;
import com.fanglin.decoration.po.AuditScalePO;
import com.fanglin.decoration.service.AuditRecordService;
import com.fanglin.decoration.vo.AuditRecordVO;
import com.fanglin.decoration.vo.AuditVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("auditRecordService")
@Transactional(readOnly = true)
public class AuditRecordServiceImpl implements AuditRecordService {
	
	@Autowired
	private AuditDao auditDao;
	
	@Autowired
	private AuditRecordDao auditRecordDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private AuditScaleDao auditScaleDao;

	@Override
	public List<AuditRecordVO> queryAuditRecordByOrderId(AuditRecordVO auditRecord) throws FLException {
		
		List<AuditRecordVO> auditRecordVOs = new ArrayList<AuditRecordVO>();
		
		AuditPO auditPO = auditDao.queryAuditByOrderId(auditRecord.getAudit().getDecoration().getOrderId());
		
		if(auditPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}
		
		List<AuditRecordPO> auditRecordPOs = auditRecordDao.queryAuditRecordByAid(auditPO.getAid());
		
		for(AuditRecordPO auditRecordPO:auditRecordPOs){
			
			AuditRecordVO auditRecordVO = new AuditRecordVO(new AuditVO());
			
			BeanUtil.copyProperties(auditRecordPO, auditRecordVO,Arrays.asList("creater"));
		
			auditRecordVOs.add(auditRecordVO);
 		}
		
		return auditRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAuditRecord(AuditRecordVO auditRecord, String userId)throws FLException {
		AuditPO auditPO = auditDao.queryAuditByOrderId(auditRecord.getAudit().getDecoration().getOrderId());
		if(auditPO==null){
			throw new FLException(140044 , "审批记录不存在");
		}
		
		AuditRecordPO auditRecordPO = new AuditRecordPO();
		
		BeanUtil.copyProperties(auditRecord, auditRecordPO,Arrays.asList("creater"));
		
		auditRecordPO.setAid(auditPO.getAid());
		UserPO creater = userDao.queryUserByUserId(userId);
		auditRecordPO.setCreater(creater);
		auditRecordPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		auditRecordDao.save(auditRecordPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAuditRecord(AuditRecordVO auditRecord) throws FLException{
		
		AuditRecordPO auditRecordPO = auditRecordDao.get(auditRecord.getArid());
		
		if(auditRecordPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}
		
		if(auditRecordPO.getStatus() != AuditRecordPO.STATUS_INIT_SHORT) {
			throw new FLException(140045, "审批记录状态不可操作");
		}
		
		List<AuditScalePO> audisScales = auditScaleDao.queryAudtiScaleByArid(auditRecord.getArid());
		
		if(!audisScales.isEmpty()) {
			throw new FLException(140045, "审批记录状态不可操作");
		}
		
		BeanUtil.copyProperties(auditRecord, auditRecordPO,Arrays.asList("creater"));
		auditRecordPO.setStatus(AuditRecordPO.STATUS_INIT_SHORT);
		auditRecordDao.update(auditRecordPO);
		
		return 0;
	}

}
