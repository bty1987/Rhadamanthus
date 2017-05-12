package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.ApprovalSalesRefundDao;
import com.fanglin.inventory.dao.ApprovalSalesRefundItemDao;
import com.fanglin.inventory.dao.RefundsItemDao;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.inventory.po.ApprovalSalesRefundItemPO;
import com.fanglin.inventory.po.ApprovalSalesRefundPO;
import com.fanglin.inventory.po.RefundsItemPO;
import com.fanglin.inventory.po.RefundsPO;
import com.fanglin.inventory.po.SalesItemPO;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.inventory.service.ApprovalSalesRefundService;
import com.fanglin.inventory.vo.ApprovalSalesRefundItemVO;
import com.fanglin.inventory.vo.ApprovalSalesRefundVO;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalSalesRefundService")
@Transactional(readOnly=true)
public class ApprovalSalesRefundServiceImpl implements ApprovalSalesRefundService{
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalSalesRefundDao approvalSalesRefundDao;
	
	@Autowired
	private ApprovalSalesRefundItemDao approvalSalesRefundItemDao;
	
	@Autowired
	private SalesItemDao salesItemDao;
	
	@Autowired
	private SalesDao salesDao;
	
	@Autowired
	private RefundsItemDao refundsItemDao;
	
	@Autowired
	private SalesPaymentDao salesPaymentDao;
	
    //获取销售退货审批向信息
	@Override
	public List<ApprovalSalesRefundItemVO> queryApprovalSalesRefundItem(ApprovalVO approvalVO) throws FLException {
		
	    ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
	    
	    if (approvalPO == null) {
			throw new FLException(240009 , "审批信息不存在");
		}
	    
	    ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalPO.getAid());
	    
	    if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
	    
	    List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
	    List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs = new ArrayList<ApprovalSalesRefundItemVO>();
	    
	    ApprovalSalesRefundItemVO approvalSalesRefundItemVO;
	    
	    for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			
	    	approvalSalesRefundItemVO = new ApprovalSalesRefundItemVO(new SalesItemVO());
	    	
	    	BeanUtil.copyProperties(approvalSalesRefundItemPO, approvalSalesRefundItemVO);
	    	BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem(), approvalSalesRefundItemVO.getSalesItem());
	    	
	    	approvalSalesRefundItemVOs.add(approvalSalesRefundItemVO);
		}
	    
		return approvalSalesRefundItemVOs;
	}

    //	提交销售退货审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForSalesRefund(ApprovalVO approvalVO,ApprovalSalesRefundVO approvalSalesRefundVO,List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs,String userId) throws FLException {
		
		
		long sid = approvalSalesRefundVO.getSid();
		
		short type = 10;
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(type, String.valueOf(sid));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		SalesPO salesPO = salesDao.querySalesBySid(sid);
		
		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
//		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentBySid(sid);
//		
//		if (salesPaymentPOs.size() > 0) {
//			throw new FLException(240006, "存在未处理收款信息");
//		}
//		
		approvalPO = new ApprovalPO();
		
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		String refundType = approvalSalesRefundVO.getType() == SalesPO.STATUS_ALLBACK_SHORT ? "全退" : approvalSalesRefundVO.getType() == SalesPO.STATUS_DBACKORDER_SHORT ? "倒单" : "退货";
		String APPROVAL_CONTENTS_SALES_REFUND_STR = "订单号:%s,销售单号:%s,品牌:%s,退款金额:%s,类型:%s";
		
		approvalPO.setType(type);//销售退货
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);//初始
		approvalPO.setIdent(String.valueOf(sid));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		//过滤条件     订单号:%s,销售单号:%s,品牌:%s,退款金额:%s,类型:%s
		approvalPO.setContents(String.format(APPROVAL_CONTENTS_SALES_REFUND_STR, salesPO.getOrderId(),salesPO.getNo(),salesPO.getBrand(),approvalSalesRefundVO.getRefund(),refundType));
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		approvalPO.setSender(new UserPO(userId));
		
		approvalDao.save(approvalPO);
		
		ApprovalSalesRefundPO approvalSalesRefundPO = new ApprovalSalesRefundPO();
		approvalSalesRefundPO.setAid(approvalPO.getAid());
		approvalSalesRefundPO.setSid(sid);
		approvalSalesRefundPO.setRefund(approvalSalesRefundVO.getRefund());
		approvalSalesRefundPO.setType(approvalSalesRefundVO.getType());
		
		approvalSalesRefundDao.save(approvalSalesRefundPO);
		
		for (ApprovalSalesRefundItemVO approvalSalesRefundItemVO : approvalSalesRefundItemVOs) {
			
			SalesItemPO salesItemPO = salesItemDao.querySalesItemBySiid(approvalSalesRefundItemVO.getSalesItem().getSiid());
			
//			if (salesItemPO == null) {
//				throw new FLException(180007, "销售单不存在操作型号信息");
//			}
			
			if (salesItemPO.getNum() >= approvalSalesRefundItemVO.getNum() && salesItemPO.getTotal() >= approvalSalesRefundItemVO.getTotal()) {
				salesItemPO.setNum(Arith.sub(salesItemPO.getNum(), approvalSalesRefundItemVO.getNum()));
				salesItemPO.setTotal(Arith.sub(salesItemPO.getTotal(), approvalSalesRefundItemVO.getTotal()));
			}else {
//				throw new FLException(180008, "销售单退货型号数量不足");
			}
			
			salesItemDao.update(salesItemPO);
			
			ApprovalSalesRefundItemPO approvalSalesRefundItemPO = new ApprovalSalesRefundItemPO();
			
			approvalSalesRefundItemPO.setNum(approvalSalesRefundItemVO.getNum());//退货数量
			approvalSalesRefundItemPO.setTotal(approvalSalesRefundItemVO.getTotal());//退货金额
			approvalSalesRefundItemPO.setAsrid(approvalSalesRefundPO.getAsrid());
			approvalSalesRefundItemPO.setSid(sid);
			approvalSalesRefundItemPO.setSalesItem(salesItemPO);//销售单型号信息类
			
			approvalSalesRefundItemDao.save(approvalSalesRefundItemPO);
			
//			MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
//			
//			messageService.sendMessage(messageVO);
		}
		return 0;
	}

	// 批准销售退款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForSalesRefund(ApprovalPO approvalPO) throws FLException {
		
		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalPO.getAid());
		
		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		
		SalesPO salesPO = salesDao.get(approvalSalesRefundPO.getSid());
		
		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();
		
		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setCreater(approvalPO.getSender());
		salesPaymentPO.setCreaterName(approvalPO.getSender().getUserName());
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setReferMoney(approvalSalesRefundPO.getRefund());//退款金额
		salesPaymentPO.setBrand(salesPO.getBrand());//品牌
		
		salesPaymentDao.save(salesPaymentPO);
		
		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
		
//		float refundMoney = 0;
//		int balanceStatus = salesPO.getBalanceStatus();//结算状态
		
		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			
			SalesItemPO salesItemPO = approvalSalesRefundItemPO.getSalesItem();
			
			RefundsItemPO refundsItemPO = new RefundsItemPO();
			RefundsPO refundsPO = new RefundsPO();
			
			float num = approvalSalesRefundItemPO.getNum();//退货数量
			float total = approvalSalesRefundItemPO.getTotal();//退货金额
//			float price = salesItemPO.getPrice();//价位
//			float discount = salesItemPO.getDiscount();//折扣价
			
			BeanUtil.copyProperties(salesItemPO, refundsItemPO);
			refundsItemPO.setTotal(total);
			refundsItemPO.setNum(num);
			refundsPO.setSid(approvalSalesRefundItemPO.getSid());
			
			refundsItemDao.save(refundsItemPO);
			
		}
	
		
		if (approvalSalesRefundPO.getType() != 0) {
			salesPO.setStatus(approvalSalesRefundPO.getType());
		}
		
		salesDao.update(salesPO);
		
		return 0;
	}

	//拒绝销售退款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseForSalesRefund(ApprovalPO approvalPO) throws FLException {
		
		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalPO.getAid());
		
		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		
		SalesPO salesPO = salesDao.get(approvalSalesRefundPO.getSid());
		
		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
		
		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			SalesItemPO salesItemPO = approvalSalesRefundItemPO.getSalesItem();
			
			if (salesItemPO == null) {
//				throw new FLException(180007, "销售单不存在操作型号信息");
			}
			
			salesItemPO.setNum(Arith.add(salesItemPO.getNum(), approvalSalesRefundItemPO.getNum()));
			salesItemPO.setTotal(Arith.add(salesItemPO.getTotal(), approvalSalesRefundItemPO.getTotal()));
			
			salesItemDao.update(salesItemPO);
			
		}
		
		return 0;
	}

}
