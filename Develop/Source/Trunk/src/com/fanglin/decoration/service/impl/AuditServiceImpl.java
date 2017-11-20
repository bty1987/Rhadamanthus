package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.service.AuditService;
import com.fanglin.decoration.vo.AuditVO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
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
			
			BeanUtil.copyProperties(auditPO, auditVO, Arrays.asList("decorationOrder","auditer"));
			
			auditVO.setDecorationOrder(new DecorationOrderVO());
			
			if(auditPO.getAuditer()!=null){
				
				auditVO.setAuditer(new UserVO());			
				
				BeanUtil.copyProperties(auditPO.getAuditer(), auditVO.getAuditer(),Arrays.asList("role","dept","duty"));
				
			}
			
			BeanUtil.copyProperties(auditPO.getDecorationOrder(), auditVO.getDecorationOrder(),
					Arrays.asList("villagePO","customerPO","designerPO","versionPO"));
			
			auditVO.getDecorationOrder().setVersionId(auditPO.getDecorationOrder().getVersionPO().getVersionId());
			
			auditVO.getDecorationOrder().setVersionName(auditPO.getDecorationOrder().getVersionPO().getVersionName());
			
			auditVO.getDecorationOrder().setVillage(new VillageVO());
			
			BeanUtil.copyProperties(auditPO.getDecorationOrder().getVillagePO(), auditVO.getDecorationOrder().getVillage(),
					Arrays.asList("cityProper","buildingNameRule"));
			
			auditVO.getDecorationOrder().setCustomer(new CustomerVO());
			
			BeanUtil.copyProperties(auditPO.getDecorationOrder().getCustomerPO(), auditVO.getDecorationOrder().getCustomer());
			
			UserPO designer = auditPO.getDecorationOrder().getDesignerPO();
			auditVO.getDecorationOrder().setDesigner(designer.getCurrentName());
			auditVO.setDesignerId(designer.getUid());
			auditVO.getDecorationOrder().setDesignerId(designer.getUserId());
			auditVO.getDecorationOrder().setDesignerPhone(designer.getPhone());
			auditVO.getDecorationOrder().setDesignDepartment(designer.getDept().getDeptName());
			auditVO.setDeptId(designer.getDept().getDeptId());
			
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
