
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
import com.fanglin.inventory.dao.SalesBalanceDao;
import com.fanglin.inventory.dao.SalesBalanceItemDao;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.inventory.po.RefundsItemPO;
import com.fanglin.inventory.po.RefundsPO;
import com.fanglin.inventory.po.SalesBalanceItemPO;
import com.fanglin.inventory.po.SalesBalancePO;
import com.fanglin.inventory.po.SalesItemPO;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
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
	
	@Autowired
	private RefundsDao refundsDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private SalesBalanceItemDao salesBalanceItemDao;
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
	public int submitApprovalForSalesRefund(ApprovalVO approvalVO,ApprovalSalesRefundVO approvalSalesRefundVO,List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs,String userId,int company) throws FLException {

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
	
		approvalPO = new ApprovalPO();
		
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		String refundType = approvalSalesRefundVO.getType() == SalesPO.STATUS_ALLBACK_SHORT ? "全退" : approvalSalesRefundVO.getType() == SalesPO.STATUS_DBACKORDER_SHORT ? "倒单" : "退货";
	
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT);//销售退货
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);//初始
		approvalPO.setIdent(String.valueOf(sid));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		//过滤条件     订单号:%s,销售单号:%s,品牌:%s,退款金额:%s,类型:%s
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_SALES_REFUND_STR, salesPO.getOrderId(),salesPO.getNo(),salesPO.getBrand(),approvalSalesRefundVO.getRefund(),refundType));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalSalesRefundPO approvalSalesRefundPO = new ApprovalSalesRefundPO();
		approvalSalesRefundPO.setAid(approvalPO.getAid());
		approvalSalesRefundPO.setSid(sid);
		approvalSalesRefundPO.setRefund(approvalSalesRefundVO.getRefund());
		approvalSalesRefundPO.setType(approvalSalesRefundVO.getType());
		
		approvalSalesRefundDao.save(approvalSalesRefundPO);
		
		for (ApprovalSalesRefundItemVO approvalSalesRefundItemVO : approvalSalesRefundItemVOs) {
			if(approvalSalesRefundItemVO!=null){
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

		SalesPO salesPO = salesDao.querySalesBySid(approvalSalesRefundPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		float refundMoney = 0;
		short balanceStatus = salesPO.getBalanceStatus();
		
		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();
		
		salesPaymentPO.setSales(salesPO);
		
		salesPaymentPO.setCreater(approvalPO.getSender());
		salesPaymentPO.setCreaterName(approvalPO.getSender().getUserName());
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setReferMoney(approvalSalesRefundPO.getRefund());//退款金额
		salesPaymentPO.setBrand(salesPO.getBrand());//品牌
		salesPaymentPO.setStatus(SalesPO.STATUS_INIT_SHORT);
		salesPaymentPO.setType(SalesPaymentPO.COLUMN_REFUNDSTYPE_INT);
		
		salesPaymentDao.save(salesPaymentPO);
		
		UserPO userPO = userDao.queryUserByUserId(approvalPO.getSender().getUserId());
		RefundsPO refundsPO = new RefundsPO();
		
		refundsPO.setSid(salesPO.getSid());
		refundsPO.setSpid(salesPaymentPO.getSpid());
		refundsPO.setCreater(userPO);
		refundsPO.setTotal(approvalSalesRefundPO.getRefund());
		refundsPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		refundsPO.setStatus(RefundsPO.STATUS_TYPE_REFUNDS_INT);
		refundsPO.setComment(approvalPO.getContents());
		
		refundsDao.save(refundsPO);
		
		SalesBalancePO salesBalancePO = new SalesBalancePO ();
		
		if (balanceStatus==SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT||balanceStatus==SalesPO.BALANCESTATUS_SETTLEMENT_SHORT) {
				
		salesBalancePO.setSales(salesPO);
		salesBalancePO.setRefunds(refundsPO);
		salesBalancePO.setCreater(approvalPO.getSender());
		salesBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesBalancePO.setTotal(Arith.sub(0, approvalSalesRefundPO.getRefund()));
		salesBalancePO.setBalance(refundMoney);
		salesBalancePO.setVbalance(0f);
		salesBalancePO.setPbalance(0f);
		salesBalancePO.setType(balanceStatus==SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT?SalesBalancePO.TYPE_PREBALANCEREFUNDS_INT:SalesBalancePO.TYPE_BALANCEREFUNDS_INT);
		salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
		salesBalancePO.setComment(salesPO.getComment());
		
		salesBalanceDao.save(salesBalancePO);
		
		}
		
		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
		
		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			
			SalesItemPO salesItemPO = approvalSalesRefundItemPO.getSalesItem();

			float price=salesItemPO.getPrice();//折让价
			float disPrice=salesItemPO.getDisPrice();//折扣价
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
			
			if (balanceStatus==SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT||balanceStatus==SalesPO.BALANCESTATUS_SETTLEMENT_SHORT) {
                 //0: 底价 , 1: 点位	
				float cvalue=salesItemPO.getCvalue();//结算值
				
	             //利润 = (折让价 - 底价) * 数量
				if (salesItemPO.getCtype()==SalesItemPO.CTYPE_RESERVEPRICE_INT) {//0: 底价
					refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(price, cvalue), num));
					}else if (salesItemPO.getCtype()==SalesItemPO.CTYPE_POINT_INT) { //1: 点位
						//利润 = (折让价 - 折扣价 * (1 - 点位)) * 数量   == (折让价 - 折扣价+折扣价 *点位)* 数量
						refundMoney =  Arith.sub(refundMoney, Arith.mul(Arith.sub(Arith.mul(disPrice, cvalue), Arith.sub(disPrice, price)), num));
					}
				SalesBalanceItemPO salesBalanceItemPO = new SalesBalanceItemPO ();
				salesBalanceItemPO.setCtype(salesItemPO.getCtype());
				salesBalanceItemPO.setCvalue(cvalue);
				salesBalanceItemPO.setNum(approvalSalesRefundItemPO.getNum());
				salesBalanceItemPO.setRawCvalue(salesItemPO.getRawCvalue());
				salesBalanceItemPO.setSalesItem(salesItemPO);
				salesBalanceItemPO.setRawCtype(salesItemPO.getRawCtype());
				salesBalanceItemPO.setSbid(salesBalancePO.getSbid());
				salesBalanceItemPO.setTotal(Arith.sub(0, approvalSalesRefundItemPO.getTotal()));
				salesBalanceItemDao.save(salesBalanceItemPO);
				
			}
		}
		
		if (balanceStatus==SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT||balanceStatus==SalesPO.BALANCESTATUS_SETTLEMENT_SHORT) {
			salesBalancePO.setBalance(refundMoney);
		
			salesBalanceDao.update(salesBalancePO);
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
		
		SalesPO salesPO = salesDao.querySalesBySid(approvalSalesRefundPO.getSid());
		
		if (salesPO == null) {
			throw new FLException(260021 , "销售单不存在");
		}
		
		salesPO.setStatus(SalesPO.STATUS_INIT_SHORT);
		salesDao.update(salesPO);
		
		
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
