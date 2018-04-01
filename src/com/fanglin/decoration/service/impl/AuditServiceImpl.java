package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.service.AuditService;
import com.fanglin.decoration.vo.AuditVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("auditService")
@Transactional(readOnly=true)
public class AuditServiceImpl implements AuditService{
	
	@Autowired
	private AuditDao auditDao;
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<AuditVO> pageAudit(Paging paging, List<Filter> filters, int company) {
		
		List<AuditPO> AuditPOs = auditDao.pageAudit(paging, filters, company);
		
		List<AuditVO> AuditVOs = new ArrayList<AuditVO>();
		
		for(AuditPO auditPO:AuditPOs){
			
			AuditVO auditVO = new AuditVO();
			
			BeanUtil.copyProperties(auditPO, auditVO, Arrays.asList("decoration","auditer"));
			
			auditVO.setDecoration(new DecorationVO());
			
			if(auditPO.getAuditer()!=null){
				
				auditVO.setAuditer(new UserBaseVO());			
				
				BeanUtil.copyProperties(auditPO.getAuditer(), auditVO.getAuditer(),Arrays.asList("dept","duty"));
				
			}
			
			auditPO.getDecoration().ptvcascade(auditVO.getDecoration()); 
			
			auditVO.getDecoration().setVersion(new QuotationVersionVO());
			auditVO.getDecoration().getVersion().setVersionId(auditPO.getDecoration().getVersion().getVersionId());			
			auditVO.getDecoration().getVersion().setVersionName(auditPO.getDecoration().getVersion().getVersionName());

			UserPO designer = auditPO.getDecoration().getDesigner();
			auditVO.getDecoration().getDesigner().setDuty(new DutyVO());
			auditVO.getDecoration().getDesigner().setDept(new DepartmentVO());
			auditVO.getDecoration().getDesigner().getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyPropertie(designer, auditVO.getDecoration().getDesigner(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(designer.getDuty(), auditVO.getDecoration().getDesigner().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(designer.getDept(), auditVO.getDecoration().getDesigner().getDept(), Arrays.asList("type","fatherDept","cityProper"));
			BeanUtil.copyPropertie(designer.getDept().getFatherDept(), auditVO.getDecoration().getDesigner().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));		
			
			AuditVOs.add(auditVO);
		}
		
		paging.setData(AuditVOs);
				
		return AuditVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void applyAudit(AuditVO auditVO, String UserId) throws FLException{
	
		AuditPO auditPO = auditDao.get(auditVO.getAid());
		
		if(auditPO == null){
			throw new FLException(140044 , "审批记录不存在");	
		}
		
		if(auditPO.getAuditer()!=null){
			throw new FLException(140048, "审核人已存在");			
		}
		
		auditPO.setAuditer(userDao.queryUserByUserId(UserId));
		auditPO.setAuditTime(new Timestamp(System.currentTimeMillis()));
		auditDao.update(auditPO);
		
	}
	
}
