package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.AuditRecordDao;
import com.fanglin.decoration.dao.AuditScaleDao;
import com.fanglin.decoration.po.AuditRecordPO;
import com.fanglin.decoration.po.AuditScalePO;
import com.fanglin.decoration.service.AuditScaleService;
import com.fanglin.decoration.vo.AuditScaleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("AuditScaleService")
@Transactional(readOnly = true)
public class AuditScaleServiceImpl implements AuditScaleService {
	
	@Autowired
	private AuditScaleDao auditScaleDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private AuditRecordDao auditRecordDao;
	
	@Override
	public List<AuditScaleVO> queryAudtiScaleByArid(AuditScaleVO auditScale) {
		
		List<AuditScaleVO> auditScaleVOs = new ArrayList<AuditScaleVO>();
		List<AuditScalePO> auditScalePOs = auditScaleDao.queryAudtiScaleByArid(auditScale.getAuditRecord().getArid());
		
		for(AuditScalePO auditScalePO:auditScalePOs){
			AuditScaleVO auditScaleVO = new AuditScaleVO(new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(auditScalePO, auditScaleVO,Arrays.asList("belongUser","belongDepartment","creater"));
			BeanUtil.copyProperties(auditScalePO.getCreater(), auditScaleVO.getCreater(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(auditScalePO.getBelongUser(), auditScaleVO.getBelongUser(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(auditScalePO.getBelongDepartment(), auditScaleVO.getBelongDepartment(),Arrays.asList("fatherDept", "type", "manager"));
			
			auditScaleVOs.add(auditScaleVO);
		}
		
		
		return auditScaleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeAuditScale(List<AuditScaleVO> auditScales, String userId) throws FLException {
		
		AuditRecordPO auditRecordPO = auditRecordDao.queryAuditRecordByArid(auditScales.get(0).getAuditRecord().getArid());
		
		if(auditRecordPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}
		
		if(auditRecordPO.getStatus()!=AuditRecordPO.STATUS_INIT_SHORT){
			throw new FLException(140045 , "审批记录状态不可操作");
		}
		
		auditRecordPO.setStatus(AuditRecordPO.STATUS_NOTINIT_SHORT);
		
		auditRecordDao.update(auditRecordPO);
		
		for(AuditScaleVO auditScaleVO:auditScales){
			
			List<AuditScalePO> _auditScales = auditScaleDao.queryAudtiScaleByArid(auditScaleVO.getAuditRecord().getArid());
			
			for(AuditScalePO auditScalePO:_auditScales){
				if(!(auditScalePO.getStatus() == AuditScalePO.STATUS_INIT_INT ||auditScalePO.getStatus() == AuditScalePO.STATUS_CONFIRM_INT )){
					throw new FLException(140046, "审批比例生成失败");
				}
			}
					
			AuditScalePO auditScalePO = new AuditScalePO(new UserPO(),new DepartmentPO());
			
			BeanUtil.copyProperties(auditScaleVO, auditScalePO,Arrays.asList("auditRecord","belongUser","belongDepartment","creater"));
			
			auditScalePO.setArid(auditScaleVO.getAuditRecord().getArid());
	
			UserPO belonguser = userDao.get(auditScaleVO.getBelongUser().getUid());
			auditScalePO.setBelongUser(belonguser);
			auditScalePO.setBelongDepartment(belonguser.getDept());
			
			UserPO creater = userDao.queryUserByUserId(userId);
			auditScalePO.setCreater(creater);
			auditScalePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			
			auditScaleDao.save(auditScalePO);
		}
				
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAuditScale(AuditScaleVO auditScale, String userId) throws FLException{
		AuditScalePO auditScalePO = new AuditScalePO(new UserPO(),new DepartmentPO());
		
		BeanUtil.copyProperties(auditScale, auditScalePO,Arrays.asList("belongUser","belongDepartment","creater"));
		
		AuditRecordPO auditRecordPO = auditRecordDao.get(auditScale.getAuditRecord().getArid());
		
		if(auditRecordPO == null){
			throw new FLException(140046 , "审批比例生成失败");
		}
		
		List<AuditScalePO> auditScalePOs = auditScaleDao.queryAudtiScaleByArid(auditScale.getAuditRecord().getArid());
		
		for(AuditScalePO auditScalePOO:auditScalePOs){
			if(!(auditScalePOO.getStatus() == AuditScalePO.STATUS_INIT_INT ||auditScalePOO.getStatus() == AuditScalePO.STATUS_CONFIRM_INT )){
				throw new FLException(140047, "审批比例信息状态不可操作");
			}
		}
		auditScalePO.setArid(auditRecordPO.getArid());
		
		UserPO belonguser = userDao.queryUserByUserId(auditScale.getBelongUser().getUserId());
		auditScalePO.setBelongUser(belonguser);
		auditScalePO.setBelongDepartment(belonguser.getDept());
		
		UserPO creater = userDao.queryUserByUserId(userId);
		auditScalePO.setCreater(creater);
		auditScalePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		auditScaleDao.save(auditScalePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAuditScaleForStatus(AuditScaleVO auditScale) throws FLException{
		AuditScalePO auditScalePO = auditScaleDao.get(auditScale.getAsid());
		
		boolean status = true;
		
		if(auditScale.getStatus()==AuditScalePO.STATUS_CONFIRM_INT  && auditScalePO.getStatus()==AuditScalePO.STATUS_INIT_INT){
			status = false;
		}else if(auditScale.getStatus()==AuditScalePO.STATUS_CHARGE_INT  && auditScalePO.getStatus()==AuditScalePO.STATUS_CONFIRM_INT){
			status = false;
		}else if(auditScale.getStatus()==AuditScalePO.STATUS_ROLL_INT  && auditScalePO.getStatus()==AuditScalePO.STATUS_CHARGE_INT){
			status = false;
		}
		
		if(status){
			throw new FLException(140047 , "审批比例信息状态不可操作");
		}
		
		auditScalePO.setStatus(auditScale.getStatus());
		
		auditScaleDao.save(auditScalePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAuditScale(AuditScaleVO auditScale) throws FLException {
		
		AuditScalePO auditScalePO = auditScaleDao.get(auditScale.getAsid());
		
		if(!(auditScalePO.getStatus() == AuditScalePO.STATUS_INIT_INT ||auditScalePO.getStatus() == AuditScalePO.STATUS_CONFIRM_INT )){
			throw new FLException(140047 , "审批比例信息状态不可操作");
		}
		
		auditScaleDao.delete(auditScalePO);
		
		return 0;
	}

}
