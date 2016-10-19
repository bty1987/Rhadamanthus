/**
 * @File Name		: DecorationPaymentServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.service.CustomerService;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.decoration.dao.AddReduceDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.finance.service.FinanceService;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.DecorationReceiptVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("decorationPaymentService")
@Transactional(readOnly = true)
public class DecorationPaymentServiceImpl implements DecorationPaymentService {

	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationContractDao decorationContractDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private DecorationReceiptDao decorationReceiptDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private FinanceService financeService;
	
//	@Autowired
//	private DecorationActivityItemDao decorationActivityItemDao;
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void pageDecorationPaymentsForBaseByOrderId(Paging paging, DecorationPaymentVO decorationPaymentVO){
		
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		List<DecorationPaymentPO> baseps = decorationPaymentDao.pageDecorationPaymentForBaseByOrderId(paging, decorationPaymentVO.getOrderId());

		for(DecorationPaymentPO decorationPaymentPO: baseps){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);
			
			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
			BeanUtil.copyProperties(decorationReceiptPO, _decorationPaymentVO);
			
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
			
			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			_decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			_decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			
			_decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		paging.setData(decorationPaymentVOs);
	}
	
	@Override
	public void pageDecorationPaymentForOtherByOrderId(Paging paging, DecorationPaymentVO decorationPaymentVO){
		
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.pageDecorationPaymentForOtherByOrderId(paging, decorationPaymentVO.getOrderId());

		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);
			
			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
			BeanUtil.copyProperties(decorationReceiptPO, _decorationPaymentVO);
			
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			_decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			_decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());

			_decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

			decorationPaymentVOs.add(_decorationPaymentVO);
		}
		
		paging.setData(decorationPaymentVOs);
	}
	
	@Override
	public void pageDecorationPaymentForCommit(Paging paging, List<FilterVO> filters){
		
		if(filters.size() == 0) return;
		
		filters.add(new FilterVO("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR, "eq"));
		
		pageDecorationPayment(paging, filters, 0);
	}
	
	@Override
	public void pageDecorationPaymentForCollect(Paging paging, List<FilterVO> filters){
		
		if(filters.size() == 0) return;

		filters.add(new FilterVO("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_PAY_STR, "eq"));

		pageDecorationPayment(paging, filters, 0);
	}
	
	@Override
	public void pageDecorationPaymentForConfirm(Paging paging, List<FilterVO> filters){
		
		if(filters.size() == 0) return;
		
		filters.add(new FilterVO("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR, "eq"));
		
		pageDecorationPayment(paging, filters, 1);
	}
	
	@Override
	public void pageDecorationPaymentForHistory(Paging paging, List<FilterVO> filters){
		
		if(filters.size() == 0) return;
		
		pageDecorationPayment(paging, filters, DecorationOrderPO.ORDERTYPE_DECORATION_INT);
	}
	
	@Override
	public List<DecorationPaymentVO> queryDecorationPayment(List<FilterVO> filters){

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPayment(filters);
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO decorationPaymentVO = changePOToVO(decorationPaymentPO);
			
			decorationPaymentVOs.add(decorationPaymentVO);
		}
		
		return decorationPaymentVOs;
	}
	
	@Override
	public DecorationPaymentVO queryDecorationPaymentById(long autoId){
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(autoId);
		DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();
		
		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

		BeanUtil.copyProperties(decorationPaymentPO, decorationPaymentVO);
		decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
		decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());
		
		decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
		decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
		decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());

		decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
		decorationPaymentVO.setContractTime(decorationOrderPO.getContractTime());

		decorationPaymentVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());

		return decorationPaymentVO;
	}
	
	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderId(DecorationPaymentVO decorationPaymentVO) {
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPaymentVO.getOrderId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		
		for(DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = changePOToVO(decorationPaymentPO);

			decorationPaymentVOs.add(_decorationPaymentVO);
		}
		
		return decorationPaymentVOs;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForBaseByOrderId(DecorationPaymentVO decorationPaymentVO){
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForBaseByOrderId(decorationPaymentVO.getOrderId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		
		for(DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);
			
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			_decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			_decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			
			_decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

			decorationPaymentVOs.add(_decorationPaymentVO);
		}
		
		return decorationPaymentVOs;
	}
	
	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderIdAIds(List<Long> paymentIds, DecorationPaymentVO decorationPaymentVO, String userId){
		
		List<String> unstatus = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTSTATUS_PAY_STR, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR});
		
		List<DecorationPaymentVO> payments = new ArrayList<DecorationPaymentVO>();
		
		if(paymentIds == null || paymentIds.size() == 0){
			return null;
		}
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByIds(paymentIds);
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);
			
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
			
			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
			BeanUtil.copyProperties(decorationReceiptPO, _decorationPaymentVO);
			
			if(!userId.equals(decorationReceiptPO.getCollectUserPO().getUserId())){
				continue;
			}

			if(!decorationOrderPO.getOrderId().equals(decorationPaymentVO.getOrderId())){
				continue;
			}
			
			if(!unstatus.contains(decorationPaymentPO.getPaymentStatus())){
				continue;
			}
			
			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCollectUser(decorationReceiptPO.getCollectUserPO().getCurrentName());
			_decorationPaymentVO.setCreateUser(decorationPaymentPO.getCreateUserPO().getCurrentName());
			
			payments.add(_decorationPaymentVO);
		}
		
		return payments;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<DecorationPaymentVO> queryDecorationPaymentForBaseAConfirmByOrderId(DecorationPaymentVO decorationPaymentVO){
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForBaseAConfirmByOrderId(decorationPaymentVO.getOrderId());

		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);
			
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			_decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			_decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			
			_decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}
	
	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForNotInitByDrId(DecorationReceiptVO decorationReceiptVO) {
		
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForNotInitByDrId(decorationReceiptVO.getDrId());

		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);
			
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			_decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			_decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			
			_decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationPaymentForOther(DecorationPaymentVO decorationPaymentVO) throws FLException{
		
		List<String> paymentTypes = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_REFUND_STR, DecorationPaymentPO.PAYMENTTYPE_ADD_STR, DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR});
		
		String paymentType = decorationPaymentVO.getPaymentType();
		
		MessageVO messageVO = new MessageVO();
		
		messageVO.setReceiver(new UserVO(decorationPaymentVO.getReceiverId()));

		if(paymentTypes.contains(paymentType) || paymentType.contains(DecorationPaymentPO.PAYMENTTYPE_REFUND_STR)){
			DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationPaymentVO.getOrderId());
			DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();

			if(decorationPaymentVO.getPaymentType().contains(DecorationPaymentPO.PAYMENTTYPE_REFUND_STR)){
				decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_APPLY_STR);
				decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationPaymentPO.setCreateUserPO(new UserPO(decorationPaymentVO.getCreateUserId()));
				decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
				decorationPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
				decorationPaymentPO.setCreateDes(decorationPaymentVO.getCreateDes());
				decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
				
				
				if(DecorationPaymentPO.PAYMENTTYPE_OTHER_STR.equals(paymentType)){
				
					decorationPaymentDao.save(decorationPaymentPO);
					
					/**
					 * 订单退款审批 refundPaymentId:-1时是其他退款 
					 * type:orderRefundApprove;orderIds:1;paymentId:01;refundPaymentId:-1;msgSerial:
					 */
					
					StringBuffer args = new StringBuffer();
					args.append("type:orderRefundApprove;");
					args.append("orderIds:");
					args.append(decorationPaymentVO.getOrderId());
					args.append(";paymentId:");
					args.append(decorationPaymentPO.getAutoId());
					args.append(";refundPaymentId:-1;msgSerial:");
					args.append("orderRefundApprove-paymentAutoId-");
					args.append(decorationPaymentPO.getAutoId());
					
					messageVO.setSender(new UserVO(decorationPaymentVO.getCreateUserId()));
					messageVO.setType("审批消息");
					messageVO.setArgs(args.toString());
					messageVO.setContents(String.format("%s,订单编号:%s,退款类型:%s,款项编号:%s,退款金额:", decorationPaymentVO.getCreateDes(), decorationOrderPO.getOrderId(), decorationPaymentVO.getPaymentType(), decorationPaymentPO.getAutoId(), decorationPaymentPO.getReferMoney()));
					messageService.sendMessage(messageVO);
				}else{
					String refundType = decorationPaymentVO.getPaymentType().substring(0, decorationPaymentVO.getPaymentType().indexOf("退款"));
					DecorationPaymentPO _decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(decorationPaymentVO.getOrderId(), refundType);
					
					if(_decorationPaymentPO == null){
						throw new FLException(150003, "款项不存在");
					}
					if(!(Math.abs(Arith.sub(_decorationPaymentPO.getPaymentBlance(), decorationPaymentPO.getReferMoney())) < 0.00000001)){
						throw new FLException(150004, "款项金额不等于余额");
					}
					if(!_decorationPaymentPO.getPaymentStatus().equals("已确认")){
						throw new FLException(150005, "款项状态非已确认,不能退款");
					}
					decorationPaymentDao.save(decorationPaymentPO);
					/**
					 * 订单退款审批
					 * type:orderRefundApprove;orderIds:1;paymentId:01;refundPaymentId:02
					 */
					
					StringBuffer args = new StringBuffer();
					args.append("type:orderRefundApprove;");
					args.append("orderIds:");
					args.append(decorationPaymentVO.getOrderId());
					args.append(";paymentId:");
					args.append(decorationPaymentPO.getAutoId());
					args.append(";refundPaymentId:");
					args.append(_decorationPaymentPO.getAutoId());
					args.append(";msgSerial:");
					args.append("orderRefundApprove-paymentAutoId-");
					args.append(decorationPaymentPO.getAutoId());
					
					StringBuffer contents = new StringBuffer();
					contents.append(decorationPaymentVO.getCreateDes());
					contents.append(",订单编号:");
					contents.append(decorationPaymentVO.getOrderId());
					contents.append(",退款类型:");
					contents.append(decorationPaymentVO.getPaymentType());
					contents.append(",款项编号:");
					contents.append(decorationPaymentPO.getAutoId());
					contents.append(",退款金额:");
					contents.append(decorationPaymentPO.getReferMoney());
					contents.append(",所退款项编号:");
					contents.append(_decorationPaymentPO.getAutoId());
					
					messageVO.setSender(new UserVO(decorationPaymentVO.getCreateUserId()));
					messageVO.setType(MessagePO.MESSAGE_TYPE_APPROVAL_STR);
					messageVO.setArgs(args.toString());
					messageVO.setContents(contents.toString());
					messageService.sendMessage(messageVO);
					
					_decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_REFUND_STR);
					decorationPaymentDao.saveOrUpdate(_decorationPaymentPO);
				}
				
			} else {
				decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationPaymentPO.setCreateUserPO(new UserPO(decorationPaymentVO.getCreateUserId()));
				decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
				decorationPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
				decorationPaymentPO.setCreateDes(decorationPaymentVO.getCreateDes());

				decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
				decorationPaymentDao.save(decorationPaymentPO);
			}
		}
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectDecorationPayment(DecorationPaymentVO decorationPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs) throws FLException{
		
		float realMoney = 0;
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();
		
		if(!DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150008, "款项不能进行收款");
		}
		
		//设置装修订单状态
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationPaymentPO.getDecorationOrderPO().getOrderId());
		
		String orderPaymentStatus = decorationOrderPO.getPaymentStatus();
		String paymentStatus = decorationPaymentPO.getPaymentStatus();
		String paymentType = decorationPaymentPO.getPaymentType();
		String houseType = decorationOrderPO.getHouseType();
		
		if((orderPaymentStatus == null || "".equals(orderPaymentStatus)) && DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(paymentType)){
			paymentStatus = DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR;
		}else if((orderPaymentStatus == null || "".equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(orderPaymentStatus)) && DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR.equals(paymentType)){
			paymentStatus = DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR;
		}else if((orderPaymentStatus == null || "".equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR.equals(orderPaymentStatus)) && DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(paymentType)){
			paymentStatus = DecorationPaymentPO.PAYMENTTYPE_FIRST_STR;
		}else if((DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(orderPaymentStatus)) && DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(paymentType)){
			paymentStatus = DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR;
		}else if(DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(paymentType) && (DecorationOrderPO.HOUSETYPE_OFFPLAN_STR.equals(houseType) && DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(orderPaymentStatus)) || (DecorationOrderPO.HOUSETYPE_COMPLETE_STR.equals(houseType) && DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(orderPaymentStatus))){
			paymentStatus = DecorationPaymentPO.PAYMENTTYPE_SECOND_STR;
		}else if((DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(orderPaymentStatus)) && DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(paymentType)){
			paymentStatus = DecorationPaymentPO.PAYMENTTYPE_FINAL_STR;
		}else{
			if(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(paymentType) || DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR.equals(paymentType) || DecorationPaymentPO.PAYMENTTYPE_ADD_STR.equals(paymentType) || DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(paymentType) || DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR.equals(paymentType) || DecorationPaymentPO.PAYMENTTYPE_REFUND_STR.contains(paymentType) || 
			   (DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(paymentType) && (DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(orderPaymentStatus))) || 
			   (DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(paymentType) && (DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(orderPaymentStatus))) || 
			   (DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(paymentType) && (DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(orderPaymentStatus) || DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(orderPaymentStatus))) || 
			   (DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(paymentType) && (DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(orderPaymentStatus)))){
				paymentStatus = "";
			}else{
				throw new FLException(150009, "收款顺序出错");
			}
		}
		
		if(paymentType.contains(DecorationPaymentPO.PAYMENTTYPE_REFUND_STR) || paymentType.equals(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR)){
			decorationReceiptPO.setReceiptType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);
		}else{
			decorationReceiptPO.setReceiptType(DecorationReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}
		
		Float advance = decorationPaymentVO.getAdvance();
		
		if(advance != null && advance != 0){
			
			int advanceType = decorationPaymentVO.getAdvanceType();
			float customerAdvance = 0f;
			String _paymentType = "";
			
			CustomerPO customerPO = decorationOrderPO.getCustomerPO();
			
			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}
			
			if(advanceType == DecorationPaymentPO.ADVANCETYPE_TYPE_BALANCE_INT){
				customerAdvance = customerPO.getAdvancePaymentPO().getBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_BALANCE_STR;
			}else if(advanceType == DecorationPaymentPO.ADVANCETYPE_TYPE_PROJECT_INT){
				customerAdvance = customerPO.getAdvancePaymentPO().getProjectBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_PROJECT_STR;
			}
			
			if(decorationPaymentVO.getAdvance() > customerAdvance){
				throw new FLException(150010, "预付款余额不足");
			}else{
				
				StringBuffer des = new StringBuffer();
				des.append("付款装修订单号:");
				des.append(decorationOrderPO.getOrderId());
				des.append(",付款类型:");
				des.append(decorationPaymentVO.getPaymentType());
				
				PaymentVO paymentVO = new PaymentVO();
				paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_STR);
				paymentVO.setCash(decorationPaymentVO.getAdvance());
				paymentVO.setDes(des.toString());
				paymentVO.setCollectUser(new UserVO(decorationPaymentVO.getCollectUserId()));
				paymentVO.setCustomer(new CustomerVO(decorationPaymentPO.getDecorationOrderPO().getCustomerPO().getId()));
				paymentVO.setPaymentType(_paymentType);
				paymentVO.setOrderId(decorationOrderPO.getOrderId());
				
				customerService.updateCustomerForBalance(paymentVO);
			}
			
			decorationReceiptPO.setAdvance(decorationPaymentVO.getAdvance());
		}
		
		Float coupon = decorationPaymentVO.getCoupon();
		
		if(coupon != null && coupon.floatValue() != 0f){
			
//			float _coupon = 0f;
//			StringBuffer couponInfo = new StringBuffer("#");
//			
//			String _couponInfo = "%s:%d:%d#";
//			
//			for(DecorationActivityItemVO decorationActivityItemVO: decorationActivityItemVOs){
//				DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
//				
//				if(decorationActivityItemPO == null){
//					throw new FLException(140030, "订单活动物品不存在");
//				}
//				
//				if(decorationActivityItemPO.getNum() < decorationActivityItemVO.getNum()){
//					throw new FLException(150023, "券数量不足");
//				}
//				
//				decorationActivityItemPO.setNum((int) Arith.sub(decorationActivityItemPO.getNum(), decorationActivityItemVO.getNum()));
//				
//				_coupon = Arith.add(_coupon, Arith.mul(decorationActivityItemVO.getNum(), decorationActivityItemPO.getMoney()));
//				
//				couponInfo.append(String.format(_couponInfo, decorationActivityItemPO.getActivityItemName(), decorationActivityItemVO.getNum(), decorationActivityItemVO.getDaiId()));
//				
//				decorationActivityItemDao.update(decorationActivityItemPO);
//			}
//			
//			if(_coupon != coupon){
//				throw new FLException(150024, "券总金额与券统计金额不等");
//			}
//			
//			decorationPaymentPO.setCoupon(_coupon);
//			decorationPaymentPO.setCouponInfo(couponInfo.toString());
//			
//			realMoney = Arith.add(_coupon, realMoney);
			
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
		}
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_QUOTATION_STR});
		
		if(status.contains(decorationOrderPO.getStatus())){
			decorationOrderPO.setStatus(DecorationOrderPO.STATUS_DEPOSIT_STR);
			decorationOrderPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		if(!paymentStatus.equals("")){
			decorationOrderPO.setPaymentStatus(paymentStatus);
		}
		
		decorationOrderDao.update(decorationOrderPO);
		
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);
		
		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float accounts = decorationPaymentVO.getAccounts();
		Float installment = decorationPaymentVO.getInstallment();
		
		if(cash != null && cash.floatValue() != 0f){
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}
		if(bank != null && bank.floatValue() != 0f){
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		}
		if(checkv != null && checkv.floatValue() != 0f){
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBankName(decorationPaymentVO.getCheckvBankName());
			realMoney = Arith.add(checkv, realMoney);
		}
		if(accounts != null && accounts.floatValue() != 0f){
			decorationReceiptPO.setAccounts(accounts);
			decorationReceiptPO.setAccountsBankName(decorationPaymentVO.getAccountsBankName());
			realMoney = Arith.add(accounts, realMoney);
		}
		if(installment != null && installment.floatValue() != 0f){
			decorationReceiptPO.setInstallment(installment);
			decorationReceiptPO.setInstallmentBankName(decorationPaymentVO.getInstallmentBankName());
			realMoney = Arith.add(installment, realMoney);
		}
		if(advance != null && advance.floatValue() != 0f){
			decorationReceiptPO.setAdvance(advance);
			decorationReceiptPO.setAdvanceType(decorationPaymentVO.getAdvanceType());
			realMoney = Arith.add(advance, realMoney);
		}
		
		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		decorationReceiptPO.setCollectUserPO(new UserPO(decorationPaymentVO.getCollectUserId()));
		decorationReceiptPO.setDes(decorationPaymentVO.getDes());
		
		decorationPaymentPO.setRealMoney(realMoney);
		decorationPaymentPO.setPaymentBlance(realMoney);
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);
		
		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);
		
		if(DecorationPaymentPO.PAYMENTTYPE_ADD_STR.equals(paymentType)){
			AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(decorationPaymentPO.getAutoId());
			addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);
			
			addReduceDao.update(addReducePO);
		}
		
		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());
		
		if(decorationOrderPO.getSupervisorPO() != null){
			com.fanglin.dingding.service.MessageService.sendMessageForPayment(decorationOrderPO.getSupervisorPO().getUserId(), "", String.format("订单:%s,地址:%s %s的%s款项,金额:%s完成收款", decorationOrderPO.getOrderId(), decorationOrderPO.getVillagePO().getVillageName(), decorationOrderPO.getHouseNumber(), decorationPaymentPO.getReferMoney(), decorationPaymentPO.getPaymentType()));
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException{
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
		
		if(!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150008, "款项不能进行收款");
		}
		
		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float accounts = decorationPaymentVO.getAccounts();
		Float installment = decorationPaymentVO.getInstallment();
		Float coupon = decorationPaymentVO.getCoupon();
		
		if(cash != null && cash.floatValue() != 0f){
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
		}else{
			decorationReceiptPO.setCash(0f);
			decorationReceiptPO.setCashInfo("");
		}
		if(bank != null && bank.floatValue() != 0f){
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
		}else{
			decorationReceiptPO.setBank(0f);
			decorationReceiptPO.setBankInfo("");
		}
		if(checkv != null && checkv.floatValue() != 0f){
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBankName(decorationPaymentVO.getCheckvBankName());
		}else{
			decorationReceiptPO.setCheckv(0f);
			decorationReceiptPO.setCheckvBankName("");
		}
		if(accounts != null && accounts.floatValue() != 0f){
			decorationReceiptPO.setAccounts(accounts);
			decorationReceiptPO.setAccountsBankName(decorationPaymentVO.getAccountsBankName());
		}else{
			decorationReceiptPO.setAccounts(0f);
			decorationReceiptPO.setAccountsBankName("");
		}
		if(installment != null && installment.floatValue() != 0f){
			decorationReceiptPO.setInstallment(installment);
			decorationReceiptPO.setInstallmentBankName(decorationPaymentVO.getInstallmentBankName());
		}else{
			decorationReceiptPO.setInstallment(0f);
			decorationReceiptPO.setInstallmentBankName("");
		}
		if(coupon != null && coupon.floatValue() != 0f){
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
		}else{
			decorationReceiptPO.setCoupon(0f);
			decorationReceiptPO.setCouponInfo("");
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		decorationReceiptPO.setCollectUserPO(new UserPO(decorationPaymentVO.getCollectUserId()));
		decorationReceiptPO.setDes(decorationPaymentVO.getDes());
		
		decorationReceiptDao.update(decorationReceiptPO);
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);
			
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationPaymentForReferMoney(DecorationPaymentVO decorationPaymentVO) throws FLException {
		
		List<String> status = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR, DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR, DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR});
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		if(!status.contains(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150022, "收款信息当前状态不能修改");
		}
		
		decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
		
		decorationPaymentDao.update(decorationPaymentPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int convertDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException{
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
		
		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
		
		if(!DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150006, "该款项不能进行转换");
		}
		
		if(!DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR.equals(decorationPaymentPO.getPaymentType()) && !DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(decorationPaymentPO.getPaymentType())){
			throw new FLException(150006, "该款项不能进行转换");
		}
		
		Float real = decorationPaymentVO.getCash();
		if(Arith.round(decorationPaymentPO.getPaymentBlance(), 2) < Arith.round((real), 2)){
			throw new FLException(150007, "款项转换失败,余额不足");
		}
		
		decorationPaymentPO.setPaymentBlance(decorationPaymentPO.getPaymentBlance()-decorationPaymentVO.getCash());
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);
		
		// 假数据 操作人是谁转入金额 备注 （orderId,paymentId,转换类型)
		// 需要将转换记录填写到预付款流水账中
		
		StringBuffer des = new StringBuffer();
		des.append("转换款项 装修订单号:");
		des.append(decorationOrderPO.getOrderId());
		des.append(",付款编号:");
		des.append(decorationPaymentPO.getAutoId());
		des.append(",付款类型:");
		des.append(decorationPaymentPO.getPaymentType());
		
		PaymentVO perPayment = new PaymentVO();
		perPayment.setType(PaymentPO.PAYMENT_TYPE_CONVERT_STR);
		perPayment.setCash(decorationPaymentVO.getCash());
		perPayment.setDes(des.toString());
		perPayment.setRecharge(decorationPaymentVO.getCash());

		perPayment.setCollectUser(new UserVO(decorationReceiptPO.getCollectUserPO().getUserId()));
		perPayment.setCustomer(new CustomerVO(decorationOrderPO.getCustomerPO().getId()));
		perPayment.setConvertPaymentId(decorationPaymentPO.getAutoId());
		perPayment.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR);
		perPayment.setOrderId(decorationOrderPO.getOrderId());
		
		customerService.updateCustomerForBalance(perPayment);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException{
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();
		
		if(!DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150012, "款项不能进行退款");
		}
		
		float real = 0f;
		
		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float coupon = decorationPaymentVO.getCoupon();
		
		if(cash != null && cash.floatValue() != 0f){
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			
			real = Arith.add(real, cash);
		}
		
		if(bank != null && bank.floatValue() != 0f){
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			
			real = Arith.add(real, bank);
		}
		
		if(coupon != null && coupon.floatValue() != 0f){
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
			
			real = Arith.add(real, coupon);
		}
		
		if(!(Math.abs(Arith.sub(decorationPaymentPO.getReferMoney(), real)) < 0.00000001)){
			throw new FLException(150013, "款项实收金额不等于应收金额");
			
		}
		
		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		decorationReceiptPO.setCollectUserPO(new UserPO(decorationPaymentVO.getCollectUserId()));
		decorationReceiptPO.setDes(decorationPaymentVO.getDes());

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);
		decorationPaymentPO.setPaymentBlance(real);
		
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);

		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);
		
		if(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(decorationPaymentPO.getPaymentType())){
			AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(decorationPaymentPO.getAutoId());
			addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);
			
			addReduceDao.update(addReducePO);
		}
		
		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundDecorationPaymentForManage(DecorationPaymentVO decorationPaymentVO, String userId) throws FLException{
		
		String orderId = decorationPaymentVO.getOrderId();
		String paymentType = decorationPaymentVO.getPaymentType();
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, paymentType);
		
		if(decorationPaymentPO != null){
			
			String paymentStatus = decorationPaymentPO.getPaymentStatus();
			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
			
			if(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(paymentStatus) || DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(paymentStatus)){
				if(DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR.equals(paymentType)){
					decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR + DecorationPaymentPO.PAYMENTTYPE_HISTORY_STR);
					
					PaymentVO paymentVO = new PaymentVO();
					paymentVO.setType(PaymentPO.PAYMENT_TYPE_COLLECTION_STR);
					paymentVO.setCash(decorationPaymentPO.getReferMoney());
					paymentVO.setCollectUser(new UserVO(userId));
					paymentVO.setCustomer(new CustomerVO(decorationOrderPO.getCustomerPO().getId()));
					paymentVO.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR);
					paymentVO.setDes("定金转合同预付款,装修订单号:" + decorationOrderPO.getOrderId());
					paymentVO.setOrderId(decorationOrderPO.getOrderId());
					
					customerService.updateCustomerForBalance(paymentVO);
					decorationPaymentDao.update(decorationPaymentPO);
				}else if(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(paymentType)){
					decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR + DecorationPaymentPO.PAYMENTTYPE_HISTORY_STR);
					
					DecorationPaymentPO newDecorationPayment = new DecorationPaymentPO();
					newDecorationPayment.setDecorationOrderPO(decorationOrderPO);
					newDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					newDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR);
					newDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
					
					DecorationPaymentPO refundDecorationPaymentPO = new DecorationPaymentPO();
					refundDecorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
					refundDecorationPaymentPO.setReferMoney(decorationPaymentPO.getReferMoney());
					refundDecorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					refundDecorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR + DecorationPaymentPO.PAYMENTTYPE_REFUND_STR);
					refundDecorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
					
					decorationPaymentDao.saveOrUpdate(decorationPaymentPO);
					decorationContractDao.saveOrUpdate(newDecorationPayment);
					decorationPaymentDao.saveOrUpdate(refundDecorationPaymentPO);
				}
				
				StringBuffer serviceRecoraInfo = new StringBuffer();
				serviceRecoraInfo.append("订单编号:");
				serviceRecoraInfo.append(orderId);
				serviceRecoraInfo.append(",时间为:");
				serviceRecoraInfo.append(DateUtil.getDateToTimestamp(new Date()).toString());
				
				ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
				serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_REFUND_DECORATIONPAYMENT_INT);
				serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				serviceRecordPO.setOperateUserId(userId);
				serviceRecordPO.setInfo(serviceRecoraInfo.toString());
				
				serviceRecordDao.saveOrUpdate(serviceRecordPO);
			}
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmDecorationPayment(List<Long> ids, String confirmUserId) throws FLException{
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByIds(ids);
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			if(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
				
				DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
				
				decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR);
				decorationReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				decorationReceiptPO.setConfirmUserPO(new UserPO(confirmUserId));
				
				if(decorationReceiptPO.getStatus() != DecorationReceiptPO.STATUS_CONFIRM_INT && SystemConfig.getInt("voucherFlag") != 0){
					decorationReceiptPO.setStatus((short) DecorationReceiptPO.STATUS_CONFIRM_INT);
					
					financeService.buildDecorationFinance(decorationPaymentPO.getDecorationOrderPO(), decorationReceiptPO, new UserPO(confirmUserId));
				}
				
				decorationReceiptDao.save(decorationReceiptPO);
				decorationPaymentDao.save(decorationPaymentPO);
			}
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int makeDecorationPayment(DecorationPaymentVO decorationPaymentVO, String createUserId) throws FLException{
		
		String orderId = decorationPaymentVO.getOrderId();
		float sumMoney = decorationPaymentVO.getReferMoney();
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR});
		List<String> paymentStatus = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		String decorationOrderStatus = decorationOrderPO.getStatus();
		String decorationOrderPaymentStatus = decorationOrderPO.getPaymentStatus();
		
		if(status.contains(decorationOrderStatus)){
			
			if(decorationOrderPaymentStatus != null && paymentStatus.contains(decorationOrderPaymentStatus)){
				throw new FLException(150001, "款项已付,不可修改");
			}
			
			float first = 30;
			float firstSecond = 35;
			float second = 32;
			
			if(QuotationPO.TYPE_PART_INT == decorationOrderPO.getType()){
				first = SystemConfig.getFloat("firstRate", 30);
				firstSecond = SystemConfig.getFloat("firstSecondRate", 35);
				second = SystemConfig.getFloat("secondRate", 32);
			}else if(QuotationPO.TYPE_WHOLE_INT == decorationOrderPO.getType()){
				first = SystemConfig.getFloat("wfirstRate", 30);
				firstSecond = SystemConfig.getFloat("wfirstSecondRate", 35);
				second = SystemConfig.getFloat("wsecondRate", 32);
				
				QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId, decorationOrderPO.getType());
				
				if(quotationPO == null){
					throw new FLException(200003, "报价不存在");
				}
				
				sumMoney = Arith.add(quotationPO.getBasicPrice(), Arith.add(quotationPO.getQdiff(), quotationPO.getMdiff()));
			}

			//重新生成款项时，由于首付款已经生成过且定金余额已被减 所以需要把自动减去的定金剩余金额补回来
			DecorationPaymentPO firstPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_FIRST_STR);
			if(firstPaymentPO != null){
				DecorationPaymentPO depositPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR);
				
				if(depositPaymentPO != null){
					if(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(depositPaymentPO.getPaymentStatus()) || DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(depositPaymentPO.getPaymentStatus())){
						depositPaymentPO.setPaymentBlance(depositPaymentPO.getPaymentBlance() + firstPaymentPO.getOther());
						decorationOrderDao.saveOrUpdate(depositPaymentPO);
					}
				}
			}
			
			decorationPaymentDao.deleteDecorationPaymentForBase(orderId);

			if(DecorationOrderPO.HOUSETYPE_COMPLETE_STR.equals(decorationOrderPO.getHouseType())){
				DecorationPaymentPO firstDecorationPayment = new DecorationPaymentPO();
				
				firstDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				firstDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				firstDecorationPayment.setReferMoney((float) (Math.ceil((sumMoney * ((first + firstSecond) / 100)) / 100) * 100));
				firstDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_FIRST_STR);
				firstDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				firstDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(firstDecorationPayment);

				DecorationPaymentPO secondDecorationPayment = new DecorationPaymentPO();
				
				secondDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				secondDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				secondDecorationPayment.setReferMoney((float) (Math.ceil((sumMoney * ((second) / 100)) / 100) * 100));
				secondDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_SECOND_STR);
				secondDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				secondDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(secondDecorationPayment);

				DecorationPaymentPO thirdDecorationPayment = new DecorationPaymentPO();
				
				thirdDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				thirdDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				thirdDecorationPayment.setReferMoney(sumMoney - (firstDecorationPayment.getReferMoney() + secondDecorationPayment.getReferMoney()));
				thirdDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_FINAL_STR);
				thirdDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				thirdDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(thirdDecorationPayment);

			} else {
				DecorationPaymentPO firstDecorationPayment = new DecorationPaymentPO();
				
				firstDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				firstDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				firstDecorationPayment.setReferMoney((float) (Math.ceil((sumMoney * ((first) / 100)) / 100) * 100));
				firstDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_FIRST_STR);
				firstDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				firstDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(firstDecorationPayment);

				DecorationPaymentPO firstSecondDecorationPayment = new DecorationPaymentPO();
				
				firstSecondDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				firstSecondDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				firstSecondDecorationPayment.setReferMoney((float) (Math	.ceil((sumMoney * ((firstSecond) / 100)) / 100) * 100));
				firstSecondDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR);
				firstSecondDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				firstSecondDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(firstSecondDecorationPayment);

				DecorationPaymentPO secondDecorationPayment = new DecorationPaymentPO();
				
				secondDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				secondDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				secondDecorationPayment.setReferMoney((float) (Math.ceil((sumMoney * ((second) / 100)) / 100) * 100));
				secondDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_SECOND_STR);
				secondDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				secondDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(secondDecorationPayment);

				DecorationPaymentPO thirdDecorationPayment = new DecorationPaymentPO();
				
				thirdDecorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				thirdDecorationPayment.setCreateUserPO(new UserPO(createUserId));
				thirdDecorationPayment.setReferMoney(sumMoney - (firstDecorationPayment.getReferMoney() + secondDecorationPayment.getReferMoney() + firstSecondDecorationPayment.getReferMoney()));
				thirdDecorationPayment.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_FINAL_STR);
				thirdDecorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
				thirdDecorationPayment.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(thirdDecorationPayment);
			}

			decorationOrderPO.setOrderTotalPrice(sumMoney);
			decorationOrderDao.saveOrUpdate(decorationOrderPO);
			
			return 0;
		} else {
			throw new FLException(150002, "合同已签订不可修改");
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationPaymentForStatus(DecorationPaymentVO payment) throws FLException{
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(payment.getAutoId());

		if(decorationPaymentPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		String paymentStatus = decorationPaymentPO.getPaymentStatus();
		String paymentType = decorationPaymentPO.getPaymentType();
		
		if(paymentStatus.equals(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR) && payment.getPaymentStatus().equals(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR)){
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
			decorationPaymentPO.setCreateUserPO(new UserPO(payment.getCreateUserId()));
			decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			
			if(DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(paymentType)){ // 对于首付款 提交时需要将应收款项减去已付款的定金的余额
				
				DecorationPaymentPO _decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(decorationPaymentPO.getDecorationOrderPO().getOrderId(), DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR);
				if(_decorationPaymentPO != null && (DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(_decorationPaymentPO.getPaymentStatus()) || DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(_decorationPaymentPO.getPaymentStatus()))){
					
					decorationPaymentPO.setOther(_decorationPaymentPO.getPaymentBlance());
					decorationPaymentPO.setReferMoney(Arith.sub(decorationPaymentPO.getReferMoney(), _decorationPaymentPO.getPaymentBlance()));
					
					_decorationPaymentPO.setPaymentBlance((float) 0);
					decorationPaymentDao.saveOrUpdate(_decorationPaymentPO);
				}
			}
		} else if(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR.equals(paymentStatus) && DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(payment.getPaymentStatus())){
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);
		} else if(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(paymentStatus) && DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(payment.getPaymentStatus())){
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR);
		} else if(DecorationPaymentPO.PAYMENTSTATUS_APPLY_STR.equals(paymentStatus) && DecorationPaymentPO.PAYMENTSTATUS_UNPASS_STR.equals(payment.getPaymentStatus())){
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPASS_STR);
		} else if(DecorationPaymentPO.PAYMENTSTATUS_APPLY_STR.equals(paymentStatus) && DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR.equals(payment.getPaymentStatus())){
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
		}
		
		decorationOrderDao.update(decorationPaymentPO);
		
		return 0;
	}

	private DecorationPaymentVO changePOToVO(DecorationPaymentPO decorationPaymentPO){
		DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();
		BeanUtil.copyProperties(decorationPaymentPO, decorationPaymentVO);
		
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
		
		if(decorationReceiptPO != null){
			BeanUtil.copyProperties(decorationReceiptPO, decorationPaymentVO);
			
			if(decorationReceiptPO.getCollectUserPO() != null){
				UserPO collectUser = decorationReceiptPO.getCollectUserPO();

				decorationPaymentVO.setCollectUserId(collectUser.getUserId());
				decorationPaymentVO.setCollectUser(collectUser.getCurrentName());
			}else{
				decorationPaymentVO.setCollectUserId("");
				decorationPaymentVO.setCollectUser("");
			}

			if(decorationReceiptPO.getConfirmUserPO() != null){
				UserPO confirmUser = decorationReceiptPO.getConfirmUserPO();

				decorationPaymentVO.setConfirmUserId(confirmUser.getUserId());
				decorationPaymentVO.setConfirmUser(confirmUser.getCurrentName());
			}else{
				decorationPaymentVO.setConfirmUserId("");
				decorationPaymentVO.setConfirmUser("");
			}
		}
		
		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
		CustomerPO customerPO = decorationOrderPO.getCustomerPO();
		VillagePO villagePO = decorationOrderPO.getVillagePO();
		UserPO designer = decorationOrderPO.getDesignerPO();
		UserPO salesman = decorationOrderPO.getSalesmanPO();

		decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
		decorationPaymentVO.setCustomerId(customerPO.getCustomerId());
		decorationPaymentVO.setCustomer(customerPO.getCustomerName());
		decorationPaymentVO.setVillage(villagePO.getVillageName());
		decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());
		decorationPaymentVO.setDesigner(designer.getCurrentName());
		decorationPaymentVO.setDesignerDepartment(designer.getDept().getDeptName());
		decorationPaymentVO.setDesignerRegion(designer.getDept().getFatherDept().getDeptName());
		decorationPaymentVO.setSalesman(salesman.getCurrentName());
		
		decorationPaymentVO.setCityProper(villagePO.getCityProper().getCityProperName());
		
		decorationPaymentVO.setOrderTotalPrice(decorationPaymentPO.getDecorationOrderPO().getOrderTotalPrice());
		decorationPaymentVO.setOrderStatus(decorationPaymentPO.getDecorationOrderPO().getStatus());

		return decorationPaymentVO;
	}
	
	@Override
	public int deleteDecorationPaymentById(DecorationPaymentVO payment){
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationPaymentForTime(DecorationPaymentVO decorationPaymentVO, Timestamp dateTime, String userId){
		
		Timestamp oldDateTime = null;
		Timestamp oldConfirmTime = null;
		
		String orderId = decorationPaymentVO.getOrderId();
		String paymentType = decorationPaymentVO.getPaymentType();
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, paymentType);
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
		
		if(decorationPaymentPO != null && (DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus()) || DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPO.getPaymentStatus()))){
			oldDateTime = decorationReceiptPO.getCollectTime();
			
			decorationReceiptPO.setCollectTime(dateTime);
			
			if(decorationReceiptPO.getConfirmTime().before(dateTime)){
				oldConfirmTime = decorationReceiptPO.getConfirmTime();
				
				decorationReceiptPO.setConfirmTime(dateTime);
			}
			
			decorationReceiptDao.update(decorationReceiptPO);
			decorationPaymentDao.update(decorationPaymentPO);
			
			StringBuffer serviceRecoraInfo = new StringBuffer();
			serviceRecoraInfo.append("订单编号:");
			serviceRecoraInfo.append(orderId);
			serviceRecoraInfo.append(",修改款项类型:");
			serviceRecoraInfo.append(paymentType);
			serviceRecoraInfo.append(",原收款时间:");
			serviceRecoraInfo.append(oldDateTime.toString());
			serviceRecoraInfo.append(",修改时间为:");
			serviceRecoraInfo.append(dateTime);
			
			if(oldConfirmTime != null){
				serviceRecoraInfo.append(",原确认时间:");
				serviceRecoraInfo.append(oldConfirmTime.toString());
			}
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONPAYMENT_TIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(serviceRecoraInfo.toString());
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
		
		return 0;
	}

	private void pageDecorationPayment(Paging paging, List<FilterVO> filters, int orderType){
		
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = null;
		
		if(orderType == DecorationOrderPO.ORDERTYPE_DECORATION_INT){
			
			filters.add(new FilterVO("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR, "ne"));
			filters.add(new FilterVO("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR, "ne"));
			
			decorationPaymentPOs = decorationPaymentDao.pageDecorationPaymentForCollect(paging, filters);
			
			for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
				DecorationPaymentVO decorationPaymentVO = changePOToVO(decorationPaymentPO);
				decorationPaymentVOs.add(decorationPaymentVO);
			}
			
			paging.setData(decorationPaymentVOs);
		}else{
			decorationPaymentPOs = decorationPaymentDao.pageDecorationPaymentForCollect(paging, filters);
			
			for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
				DecorationPaymentVO decorationPaymentVO = changePOToVO(decorationPaymentPO);
				decorationPaymentVOs.add(decorationPaymentVO);
			}
			
			paging.setData(decorationPaymentVOs);
		}
	}

}
