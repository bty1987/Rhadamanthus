package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationAuditDao;
import com.fanglin.decoration.dao.DecorationAuditRecordDao;
import com.fanglin.decoration.dao.DecorationAuditScaleDao;
import com.fanglin.decoration.po.DecorationAuditPO;
import com.fanglin.decoration.po.DecorationAuditRecordPO;
import com.fanglin.decoration.po.DecorationAuditScalePO;
import com.fanglin.decoration.service.DecorationAuditRecordService;
import com.fanglin.decoration.vo.DecorationAuditRecordVO;
import com.fanglin.decoration.vo.DecorationAuditVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationAuditRecordService")
@Transactional(readOnly = true)
public class DecorationAuditRecordServiceImpl implements DecorationAuditRecordService {

	@Autowired
	private DecorationAuditDao decorationAuditDao;

	@Autowired
	private DecorationAuditRecordDao decorationAuditRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationAuditScaleDao decorationAuditScaleDao;

	@Override
	public List<DecorationAuditRecordVO> queryDecorationAuditRecordByOrderId(DecorationAuditRecordVO auditRecord) throws FLException {

		List<DecorationAuditRecordVO> auditRecordVOs = new ArrayList<DecorationAuditRecordVO>();

		DecorationAuditPO auditPO = decorationAuditDao.queryDecorationAuditByOrderId(auditRecord.getAudit().getDecoration().getOrderId());

		if(auditPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}

		List<DecorationAuditRecordPO> auditRecordPOs = decorationAuditRecordDao.queryDecorationAuditRecordByAid(auditPO.getAid());

		for(DecorationAuditRecordPO auditRecordPO:auditRecordPOs){

			DecorationAuditRecordVO auditRecordVO = new DecorationAuditRecordVO(new DecorationAuditVO());

			BeanUtil.copyProperties(auditRecordPO, auditRecordVO,Arrays.asList("creater"));

			auditRecordVOs.add(auditRecordVO);
 		}

		return auditRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationAuditRecord(DecorationAuditRecordVO auditRecord, String userId)throws FLException {
		DecorationAuditPO auditPO = decorationAuditDao.queryDecorationAuditByOrderId(auditRecord.getAudit().getDecoration().getOrderId());
		if(auditPO==null){
			throw new FLException(140044 , "审批记录不存在");
		}

		DecorationAuditRecordPO auditRecordPO = new DecorationAuditRecordPO();

		BeanUtil.copyProperties(auditRecord, auditRecordPO,Arrays.asList("creater"));

		auditRecordPO.setAid(auditPO.getAid());
		UserPO creater = userDao.queryUserByUserId(userId);
		auditRecordPO.setCreater(creater);
		auditRecordPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationAuditRecordDao.save(auditRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationAuditRecord(DecorationAuditRecordVO auditRecord) throws FLException{

		DecorationAuditRecordPO auditRecordPO = decorationAuditRecordDao.get(auditRecord.getArid());

		if(auditRecordPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}

		if(auditRecordPO.getStatus() != DecorationAuditRecordPO.STATUS_INIT_SHORT) {
			throw new FLException(140045, "审批记录状态不可操作");
		}

		List<DecorationAuditScalePO> audisScales = decorationAuditScaleDao.queryDecorationAuditScaleByArid(auditRecord.getArid());

		if(!audisScales.isEmpty()) {
			throw new FLException(140045, "审批记录状态不可操作");
		}

		BeanUtil.copyProperties(auditRecord, auditRecordPO,Arrays.asList("creater"));
		auditRecordPO.setStatus(DecorationAuditRecordPO.STATUS_INIT_SHORT);
		decorationAuditRecordDao.update(auditRecordPO);

		return 0;
	}

}
