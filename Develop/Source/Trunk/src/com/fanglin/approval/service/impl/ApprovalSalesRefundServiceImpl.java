package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalSalesRefundDao;
import com.fanglin.approval.dao.ApprovalSalesRefundItemDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalSalesRefundItemPO;
import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.approval.service.ApprovalSalesRefundService;
import com.fanglin.approval.vo.ApprovalSalesRefundItemVO;
import com.fanglin.approval.vo.ApprovalSalesRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.RefundsDao;
import com.fanglin.inventory.dao.RefundsItemDao;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.inventory.po.RefundsItemPO;
import com.fanglin.inventory.po.RefundsPO;
import com.fanglin.inventory.po.SalesItemPO;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
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
	
	@Autowired
	private RefundsDao refundsDao;

	@Autowired
	private UserDao userDao;
	
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
			
	    	approvalSalesRefundItemVO = new ApprovalSalesRefundItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()));
	    	
	    	BeanUtil.copyProperties(approvalSalesRefundItemPO, approvalSalesRefundItemVO, Arrays.asList("salesItem"));
	    	BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem(), approvalSalesRefundItemVO.getSalesItem(), Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem().getGoods(), approvalSalesRefundItemVO.getSalesItem().getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem().getColor(), approvalSalesRefundItemVO.getSalesItem().getColor());
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem().getFormat(), approvalSalesRefundItemVO.getSalesItem().getFormat());
	    	approvalSalesRefundItemVOs.add(approvalSalesRefundItemVO);
		}
	    
		return approvalSalesRefundItemVOs;
	}

    //	提交销售退货审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForSalesRefund(ApprovalVO approvalVO,ApprovalSalesRefundVO approvalSalesRefundVO,List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs,String userId) throws FLException {
		
		
		long sid = approvalSalesRefundVO.getSid();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(sid));
		
		if(approvalPO != null){
			if(approvalPO.getStatus() == 0){
				throw new FLException(240004, "正在审批中,不能提交新审批");
			}
		}
		
		
		SalesPO salesPO = salesDao.querySalesBySid(sid);
		
		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		salesPO.setStatus(approvalSalesRefundVO.getType());
		salesDao.update(salesPO);
		
		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(sid);
		
		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {
			
			if (salesPaymentPO.getStatus() != 2) {
				throw new FLException(240004, "正在审批中,不能提交新审批");
			}
			
		}
		
		approvalPO = new ApprovalPO();
		
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		String refundType = approvalSalesRefundVO.getType() == SalesPO.STATUS_ALLBACK_SHORT ? "全退" : approvalSalesRefundVO.getType() == SalesPO.STATUS_DBACKORDER_SHORT ? "倒单" : "退货";
		String APPROVAL_CONTENTS_SALES_REFUND_STR = "订单号:%s,销售单号:%s,品牌:%s,退款金额:%s,类型:%s";
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT);//销售退货
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);//初始
		approvalPO.setIdent(String.valueOf(sid));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		//过滤条件     订单号:%s,销售单号:%s,品牌:%s,退款金额:%s,类型:%s
		approvalPO.setContents(String.format(APPROVAL_CONTENTS_SALES_REFUND_STR, salesPO.getOrderId(),salesPO.getNo(),salesPO.getBrand(),approvalSalesRefundVO.getRefund(),refundType));
		approvalPO.setReceiver(userDao.get(approvalVO.getReceiverId()));
		approvalPO.setSender(userDao.get(userId));
		
		approvalDao.save(approvalPO);
		
		ApprovalSalesRefundPO approvalSalesRefundPO = new ApprovalSalesRefundPO();
		approvalSalesRefundPO.setAid(approvalPO.getAid());
		approvalSalesRefundPO.setSid(sid);
		approvalSalesRefundPO.setRefund(approvalSalesRefundVO.getRefund());
		approvalSalesRefundPO.setType(approvalSalesRefundVO.getType());
		
		approvalSalesRefundDao.save(approvalSalesRefundPO);
		
		for (ApprovalSalesRefundItemVO approvalSalesRefundItemVO : approvalSalesRefundItemVOs) {
			
			SalesItemPO salesItemPO = salesItemDao.querySalesItemBySiid(approvalSalesRefundItemVO.getSalesItem().getSiid());
			
	
			salesItemPO.setNum(Arith.sub(salesItemPO.getNum(), approvalSalesRefundItemVO.getNum()));
			salesItemPO.setTotal(Arith.sub(salesItemPO.getTotal(), approvalSalesRefundItemVO.getTotal()));
			
			salesItemDao.update(salesItemPO);
			
			ApprovalSalesRefundItemPO approvalSalesRefundItemPO = new ApprovalSalesRefundItemPO();
			
			approvalSalesRefundItemPO.setNum(approvalSalesRefundItemVO.getNum());//退货数量
			approvalSalesRefundItemPO.setTotal(approvalSalesRefundItemVO.getTotal());//退货金额
			approvalSalesRefundItemPO.setAsrid(approvalSalesRefundPO.getAsrid());
			approvalSalesRefundItemPO.setSid(sid);
			approvalSalesRefundItemPO.setSalesItem(salesItemPO);//销售单型号信息类
			
			approvalSalesRefundItemDao.save(approvalSalesRefundItemPO);
			
		}
		return 0;
	}

	// 批准销售退款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForSalesRefund(ApprovalVO approvalVO,String userId) throws FLException { 
		
		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalVO.getAid());
		
		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		
		SalesPO salesPO = salesDao.querySalesBySid(approvalSalesRefundPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		
		if (approvalPO == null) {
			throw new FLException(240009 , "审批信息不存在");
		}
		
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVAL_INT);
		
		approvalDao.update(approvalPO);
		
		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();
		
		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setCreater(approvalPO.getSender());
		salesPaymentPO.setCreaterName(approvalPO.getSender().getUserName());
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setReferMoney(approvalSalesRefundPO.getRefund());//退款金额
		salesPaymentPO.setBrand(salesPO.getBrand());//品牌
		salesPaymentPO.setStatus(SalesPO.STATUS_INIT_SHORT);
		salesPaymentPO.setType(SalesPaymentPO.COLUMN_RTYPE_INT);
		
		salesPaymentDao.save(salesPaymentPO);
		
		RefundsPO refundsPO = new RefundsPO();
		
		refundsPO.setSid(salesPO.getSid());
		refundsPO.setSpid(salesPaymentPO.getSpid());
		refundsPO.setCreater(userDao.get(userId));
		refundsPO.setTotal(approvalSalesRefundPO.getRefund());
		refundsPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		refundsPO.setStatus(RefundsPO.STATUS_TYPE_REFUNDS_INT);
		refundsPO.setComment(approvalPO.getContents());
		
		refundsDao.save(refundsPO);
		
		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
		
		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			
			SalesItemPO salesItemPO = approvalSalesRefundItemPO.getSalesItem();
			
			RefundsItemPO refundsItemPO = new RefundsItemPO();
			
			float num = approvalSalesRefundItemPO.getNum();//退货数量
			float total = approvalSalesRefundItemPO.getTotal();//退货金额

			
			BeanUtil.copyProperties(salesItemPO, refundsItemPO);
			refundsItemPO.setRid(refundsPO.getRid());
			refundsItemPO.setTotal(total);
			refundsItemPO.setNum(num);
			refundsItemPO.setSid(approvalSalesRefundItemPO.getSid());
			refundsItemPO.setSalesItem(approvalSalesRefundItemPO.getSalesItem());

			
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
	public int refuseForSalesRefund(ApprovalVO approvalVO) throws FLException {
		
		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalVO.getAid());
		
		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		
		SalesPO salesPO = salesDao.querySalesBySid(approvalSalesRefundPO.getSid());
		
		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		salesPO.setStatus(SalesPO.STATUS_INIT_SHORT);
		salesDao.update(salesPO);
		
		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		
		if (approvalPO == null) {
			throw new FLException(240009 , "审批信息不存在");
		}
		
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
		
		approvalDao.update(approvalPO);
		
		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
		
		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			SalesItemPO salesItemPO = salesItemDao.querySalesItemBySiid(approvalSalesRefundItemPO.getSalesItem().getSiid());
			
			salesItemPO.setNum(Arith.add(salesItemPO.getNum(), approvalSalesRefundItemPO.getNum()));
			salesItemPO.setTotal(Arith.add(salesItemPO.getTotal(), approvalSalesRefundItemPO.getTotal()));
			
			salesItemDao.update(salesItemPO);
			
		}
		
		return 0;
	}

}
