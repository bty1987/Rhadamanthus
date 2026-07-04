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
import com.fanglin.decoration.dao.DecorationAuditDao;
import com.fanglin.decoration.po.DecorationAuditPO;
import com.fanglin.decoration.service.DecorationAuditService;
import com.fanglin.decoration.vo.DecorationAuditVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("decorationAuditService")
@Transactional(readOnly=true)
public class DecorationAuditServiceImpl implements DecorationAuditService{

	@Autowired
	private DecorationAuditDao decorationAuditDao;
	@Autowired
	private UserDao userDao;

	@Override
	public List<DecorationAuditVO> pageDecorationAudit(Paging paging, List<Filter> filters, int company) {

		List<DecorationAuditPO> auditPOs = decorationAuditDao.pageDecorationAudit(paging, filters, company);

		List<DecorationAuditVO> auditVOs = new ArrayList<DecorationAuditVO>();

		for(DecorationAuditPO auditPO:auditPOs){

			DecorationAuditVO auditVO = new DecorationAuditVO();

			BeanUtil.copyProperties(auditPO, auditVO, Arrays.asList("decoration","auditer"));

			auditVO.setDecoration(new DecorationVO());

			if(auditPO.getAuditer()!=null){

				auditVO.setAuditer(new UserBaseVO());

				BeanUtil.copyProperties(auditPO.getAuditer(), auditVO.getAuditer(),Arrays.asList("dept","duty"));

			}

			auditPO.getDecoration().ptvcascade(auditVO.getDecoration());

			auditVO.getDecoration().setVersion(new QuotationVersionVO());
			auditVO.getDecoration().getVersion().setNo(auditPO.getDecoration().getVersion().getNo());
			auditVO.getDecoration().getVersion().setName(auditPO.getDecoration().getVersion().getName());

			UserPO designer = auditPO.getDecoration().getDesigner();
			auditVO.getDecoration().getDesigner().setDuty(new DutyVO());
			auditVO.getDecoration().getDesigner().setDept(new DepartmentVO());
			auditVO.getDecoration().getDesigner().getDept().setFatherDept(new DepartmentVO());

			BeanUtil.copyPropertie(designer, auditVO.getDecoration().getDesigner(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(designer.getDuty(), auditVO.getDecoration().getDesigner().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(designer.getDept(), auditVO.getDecoration().getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(designer.getDept().getFatherDept(), auditVO.getDecoration().getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

			auditVOs.add(auditVO);
		}

		paging.setData(auditVOs);

		return auditVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void applyDecorationAudit(DecorationAuditVO auditVO, String UserId) throws FLException{

		DecorationAuditPO auditPO = decorationAuditDao.get(auditVO.getAid());

		if(auditPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}

		if(auditPO.getAuditer()!=null){
			throw new FLException(140048, "审核人已存在");
		}

		auditPO.setAuditer(userDao.queryUserByUserId(UserId));
		auditPO.setAuditTime(new Timestamp(System.currentTimeMillis()));
		decorationAuditDao.update(auditPO);

	}

}
