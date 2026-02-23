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
import com.fanglin.decoration.service.NotificationService;
import com.fanglin.decoration.vo.AuditVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationRecordDao;
import com.fanglin.quotation.po.QuotationRecordPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("auditService")
@Transactional(readOnly=true)
public class AuditServiceImpl implements AuditService{
	
	@Autowired
	private AuditDao auditDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private QuotationRecordDao quotationRecordDao;
	@Autowired
	private NotificationService notificationService;
	
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

		// 保存错误点记录
		if (auditVO.getErrorPoints() != null && !auditVO.getErrorPoints().trim().isEmpty()) {
			UserPO currentUser = userDao.queryUserByUserId(UserId);
			QuotationRecordPO recordPO = new QuotationRecordPO();
			// 获取报价单ID（需要从 decoration 中获取）
			Long qid = auditPO.getDecoration().getQuotation().getQid();
			recordPO.init(qid, auditVO.getErrorPoints(), QuotationRecordPO.TYPE_COMMON_INT, currentUser);
			quotationRecordDao.save(recordPO);

			// 钉钉推送消息给预算员
			Long budgeterId = auditPO.getDecoration().getQuotation().getBudgeter() != null ?
				auditPO.getDecoration().getQuotation().getBudgeter().getUid() : null;

			if (budgeterId != null) {
				String dingtalkMessage = String.format(
					"报价单 %s 审核完成，请查看错误点：\n%s",
					auditPO.getDecoration().getOrderId(),
					auditVO.getErrorPoints()
				);
				notificationService.sendDingtalk(budgeterId, dingtalkMessage, "报价审核错误点");
			}
		}

	}
	
}
