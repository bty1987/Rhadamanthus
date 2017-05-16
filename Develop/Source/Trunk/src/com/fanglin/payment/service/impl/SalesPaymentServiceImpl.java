package com.fanglin.payment.service.impl;

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
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.inventory.service.SalesService;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.inventory.vo.SalesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("salesPaymentService")
@Transactional(readOnly=true)
public class SalesPaymentServiceImpl implements SalesPaymentService{

	@Autowired
	private SalesService salesService;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesReceiptDao salesReceiptDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectSalesPaymentForRefund(SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException {

		SalesPO sales = salesDao.querySalesBySid(salesPaymentVO.getSid());

		if (sales == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPaymentDao.countSalesPaymentBySid(salesPaymentVO.getSid()) < 0) {
			throw new FLException(260021, "收款款项不存在");
		}

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		UserPO user = userDao.get(userId);
		salesReceiptPO.setCollecter(user);
		salesReceiptPO.setCollecterName(user.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getInstallment() != null) {
			salesReceiptPO.setInstallment(salesReceiptVO.getInstallment());
			salesReceiptPO.setInstallBank(salesReceiptVO.getInstallBank());
		} else {
			salesReceiptPO.setInstallment(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setInstallBank("");
		}

		if (salesReceiptVO.getAccounts() != null) {
			salesReceiptPO.setAccounts(salesReceiptVO.getAccounts());
			salesReceiptPO.setAccountsBank(salesReceiptVO.getAccountsBank());
		} else {
			salesReceiptPO.setAccounts(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setAccountsBank("");
		}

		if (salesReceiptVO.getAdvance() != null) {
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_STR);
		}

		if (salesReceiptVO.getDes() != null)
			salesReceiptPO.setDes(salesReceiptVO.getDes());
		else {
			salesReceiptPO.setDes("");
		}
		salesReceiptPO.setRealMoney(salesReceiptVO.getRealMoney());

		salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_COUPON_STR);
		salesReceiptPO.setCouponInfo("");

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts();
		Float referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_STR) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);

		salesPayment.setSalesReceipt(salesReceiptPO);

		salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		salesPaymentDao.update(salesPayment);

		if (salesPayment.getType() == SalesPaymentPO.COLUMN_BTYPE_INT){
			
			sales.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			
			salesDao.update(sales);
			
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundSalesPayment(SalesPaymentVO salesPaymentVO,String cuid) throws FLException{

		SalesPO sales = salesDao.querySalesBySid(salesPaymentVO.getSid());

		if (sales == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (sales.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPaymentDao.countSalesPaymentBySidAType(salesPaymentVO.getSid(), salesPaymentVO.getType()) > 0) {
			throw new FLException(150033, "款项类型已存在");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList("sales", "collecter", "confirmer"));
		BeanUtil.copyProperties(salesDao.querySalesBySid(salesPaymentVO.getSid()), salesPaymentPO.getSales(), Arrays.asList("village", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept" ));
		UserPO userPO = userDao.get(cuid);
		salesPaymentPO.setCreater(userPO);
		salesPaymentPO.setCreaterName(userPO.getUserName());
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
		salesPaymentPO.setType(salesPaymentVO.getType());
		salesPaymentPO.setBrand(sales.getBrand());
		salesPaymentPO.setCategory(sales.getCategory());
		
		if(salesPaymentVO.getType() == SalesPaymentPO.COLUMN_DTYPE_INT){
			
			salesService.updateSalesStatusWaste(sales);
			
		}else if (salesPaymentVO.getType() == SalesPaymentPO.COLUMN_BTYPE_INT){
			
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_UNPAY_SHORT);
			
			salesDao.update(sales);
		}

		salesPaymentDao.save(salesPaymentPO);

		salesPaymentVO.setSpid(salesPaymentPO.getSpid());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int cancelSalesPayment(SalesPaymentVO salesPaymentVO) throws FLException{

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());

		if(salesPayment.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
			throw new FLException(150019, "款项不能撤销");
		}

		SalesPO salesPO = salesDao.querySalesBySid(salesPayment.getSales().getSid());

		if(salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {
			
			salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
			
			salesDao.update(salesPO);
			
		}else if(salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {
			
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);
			
			salesDao.update(salesPO);
			
		}else if(salesPayment.getType() == SalesPO.STATUS_END_SHORT) {
			
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);
			
			salesDao.update(salesPO);
			
		}

		salesPaymentDao.delete(salesPayment);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmSalesPayment(List<Long> spids,String userId)  throws FLException{

		for (Long spid : spids) {
			
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);

			salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_CONFIRMEDSTATUS_INT);
			salesPaymentDao.update(salesPayment);

			SalesReceiptPO salesReceiptPO = salesReceiptDao.get(salesPayment.getSalesReceipt().getSrId());
			salesReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));
			UserPO user = userDao.get(userId);
			salesReceiptPO.setConfirmer(user);
			salesReceiptPO.setConfirmerName(user.getUserName());
			salesReceiptDao.update(salesReceiptPO);

			SalesPO salesPO = salesDao.querySalesBySid(salesPayment.getSales().getSid());

			if(salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT){
				
				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_CONFIRM_SHORT);
				
				salesDao.update(salesPO);
				
			}else if(salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT){
				
				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);
				
				salesDao.update(salesPO);
				
			}else if(salesPayment.getType() == SalesPO.STATUS_END_SHORT) {
				
				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);
				
				salesDao.update(salesPO);
				
			}

		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectSalesPayments(List<Long> spids,SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException {

		if (salesPaymentDao.countSalesPaymentBySid(salesPaymentVO.getSid()) < 0) {
			throw new FLException(260021, "收款款项不存在");
		}

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		UserPO user = userDao.get(userId);
		salesReceiptPO.setCollecter(user);
		salesReceiptPO.setCollecterName(user.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getInstallment() != null) {
			salesReceiptPO.setInstallment(salesReceiptVO.getInstallment());
			salesReceiptPO.setInstallBank(salesReceiptVO.getInstallBank());
		} else {
			salesReceiptPO.setInstallment(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setInstallBank("");
		}

		if (salesReceiptVO.getAccounts() != null) {
			salesReceiptPO.setAccounts(salesReceiptVO.getAccounts());
			salesReceiptPO.setAccountsBank(salesReceiptVO.getAccountsBank());
		} else {
			salesReceiptPO.setAccounts(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setAccountsBank("");
		}

		if (salesReceiptVO.getAdvance() != null) {
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_STR);
		}

		if (salesReceiptVO.getDes() != null)
			salesReceiptPO.setDes(salesReceiptVO.getDes());
		else {
			salesReceiptPO.setDes("");
		}
		salesReceiptPO.setRealMoney(salesReceiptVO.getRealMoney());

		salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_COUPON_STR);
		salesReceiptPO.setCouponInfo("");

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts();

		Float referMoneyPY = 0f;
		for (Long spid : spids) {
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			referMoneyPY = referMoneyPY + salesPayment.getReferMoney();
		}

		if (Arith.sub(referMoneySR, referMoneyPY) != SalesReceiptPO.COLUMN_MONEY_STR) {
			throw new FLException(260021, "当前实收款项总数与应收款项不等,请核实再进行提交!");
		}
		salesReceiptDao.save(salesReceiptPO);

		for (Long spid : spids){
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			salesPayment.setSalesReceipt(salesReceiptPO);
			salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
			salesPaymentDao.update(salesPayment);

			SalesPO salesPO = salesDao.querySalesBySid(salesPayment.getSales().getSid());

			if(salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT){
				
				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);
				
				salesDao.update(salesPO);
				
			}else if(salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT){
				
				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
				
				salesDao.update(salesPO);
				
			} 
		}
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectSalesPayment(SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException {

		if (salesPaymentDao.countSalesPaymentBySid(salesPaymentVO.getSid()) < 0) {
			throw new FLException(260021, "收款款项不存在");
		}

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		UserPO user = userDao.get(userId);
		salesReceiptPO.setCollecter(user);
		salesReceiptPO.setCollecterName(user.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		salesReceiptPO.setRealMoney(salesReceiptVO.getRealMoney());

		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getInstallment() != null) {
			salesReceiptPO.setInstallment(salesReceiptVO.getInstallment());
			salesReceiptPO.setInstallBank(salesReceiptVO.getInstallBank());
		} else {
			salesReceiptPO.setInstallment(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setInstallBank("");
		}

		if (salesReceiptVO.getAccounts() != null) {
			salesReceiptPO.setAccounts(salesReceiptVO.getAccounts());
			salesReceiptPO.setAccountsBank(salesReceiptVO.getAccountsBank());
		} else {
			salesReceiptPO.setAccounts(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setAccountsBank("");
		}

		if (salesReceiptVO.getCoupon() != null) {
			salesReceiptPO.setCoupon(salesReceiptVO.getCoupon());
			salesReceiptPO.setCouponInfo(salesReceiptVO.getCouponInfo());
		} else {
			salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setCouponInfo("");
		}

		if (salesReceiptVO.getAdvance() != null) {
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_STR);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_STR);
		}

		if (salesReceiptVO.getDes() != null)
			salesReceiptPO.setDes(salesReceiptVO.getDes());
		else {
			salesReceiptPO.setDes("");
		}

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts() + salesReceiptPO.getCoupon();
		Float referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_STR) {
			throw new FLException(260021, "当前实收款项总数与应收款项不等,请核实再进行提交!");
		}
		salesReceiptDao.save(salesReceiptPO);

		salesPayment.setSalesReceipt(salesReceiptPO);

		salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		salesPaymentDao.update(salesPayment);

		SalesPO sales = salesDao.querySalesBySid(salesPayment.getSales().getSid());
		if (salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {
			sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);
			salesDao.update(sales);
		} else if (salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			salesDao.update(sales);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSalesPayment(SalesPaymentVO salesPaymentVO,String cuid) throws FLException {

		SalesPO sales = salesDao.querySalesBySid(salesPaymentVO.getSid());

	    if (sales == null) {
	      throw new FLException(260021, "销售单不存在");
	    }

	    if (sales.getStatus() != 0) {
	      throw new FLException(260022, "销售单状态不可操作");
	    }

	    if (salesPaymentDao.countSalesPaymentBySidAType(salesPaymentVO.getSid(), salesPaymentVO.getType()) > 0) {
	      throw new FLException(150033, "款项类型已存在");
	    }

	    SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

	    BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList( "sales", "collecter", "confirmer" ));
	    BeanUtil.copyProperties(salesDao.querySalesBySid(salesPaymentVO.getSid()), salesPaymentPO.getSales(), Arrays.asList("village", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept"));
	    UserPO userPO = userDao.get(cuid);
	    salesPaymentPO.setCreater(userPO);
	    salesPaymentPO.setCreaterName(userPO.getUserName());
	    salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
	    salesPaymentPO.setType(salesPaymentVO.getType());

	    salesPaymentDao.save(salesPaymentPO);

	    salesPaymentVO.setSpid(salesPaymentPO.getSpid());

	    if (salesPaymentPO.getType() == SalesPO.STATUS_ALLBACK_SHORT) {
	      sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_UNPAY_SHORT);
	      salesDao.update(sales);
	    } else if (salesPaymentPO.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {
	      sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_UNPAY_SHORT);
	      salesDao.update(sales);
	    }

	    return 0;
	}

	@Override                  
	public List<SalesPaymentVO> querySalesPaymentForNotInitBySrid(SalesReceiptVO salesReceipt) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentForNotInitBySrid(salesReceipt.getSrId());

		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserVO() , new SalesVO(new VillageVO(), new CustomerVO(), new UserVO(), new DepartmentVO(), new DepartmentVO(), new UserVO(), new DepartmentVO(), new UserVO()) ,new SalesReceiptVO(new UserVO(),new UserVO()));

			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPaymentPO.getSales(), salesPaymentVO.getSales(), Arrays.asList("village","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getVillage(), salesPaymentVO.getSales().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getCustomer(), salesPaymentVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesPaymentPO.getSales().getSalesman(), salesPaymentVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getDept(), salesPaymentVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getRegion(), salesPaymentVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuider(), salesPaymentVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getInstorer(), salesPaymentVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuideDept(), salesPaymentVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role","dept"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}

	@Override
	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(salesPaymentVO.getSales().getSid());
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();


		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserVO() , new SalesVO(new VillageVO(), new CustomerVO(), new UserVO(), new DepartmentVO(), new DepartmentVO(), new UserVO(), new DepartmentVO(), new UserVO()) ,new SalesReceiptVO());

			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPaymentPO.getSales(), salesPaymentVO.getSales(), Arrays.asList("village","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getVillage(), salesPaymentVO.getSales().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getCustomer(), salesPaymentVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesPaymentPO.getSales().getSalesman(), salesPaymentVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getDept(), salesPaymentVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getRegion(), salesPaymentVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuider(), salesPaymentVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getInstorer(), salesPaymentVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuideDept(), salesPaymentVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}


	@Override
	public void pageSalesPaymentForNotInit(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT), "ne") );

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForNotInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserVO() , new SalesVO(new VillageVO(), new CustomerVO(), new UserVO(), new DepartmentVO(), new DepartmentVO(), new UserVO(), new DepartmentVO(), new UserVO()) ,new SalesReceiptVO(new UserVO(),new UserVO()));
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPaymentPO.getSales(), salesPaymentVO.getSales(), Arrays.asList("village","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getVillage(), salesPaymentVO.getSales().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getCustomer(), salesPaymentVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesPaymentPO.getSales().getSalesman(), salesPaymentVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getDept(), salesPaymentVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getRegion(), salesPaymentVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuider(), salesPaymentVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getInstorer(), salesPaymentVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuideDept(), salesPaymentVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role","dept"));

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);

	}

	@Override
	public void pageSalesPaymentForConfirm(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_CONFIRMEDSTATUS_INT), "eq") );

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForCollect(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserVO() , new SalesVO(new VillageVO(), new CustomerVO(), new UserVO(), new DepartmentVO(), new DepartmentVO(), new UserVO(), new DepartmentVO(), new UserVO()) ,new SalesReceiptVO(new UserVO(),new UserVO()));
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPaymentPO.getSales(), salesPaymentVO.getSales(), Arrays.asList("village","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getVillage(), salesPaymentVO.getSales().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getCustomer(), salesPaymentVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesPaymentPO.getSales().getSalesman(), salesPaymentVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getDept(), salesPaymentVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getRegion(), salesPaymentVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuider(), salesPaymentVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getInstorer(), salesPaymentVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuideDept(), salesPaymentVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			//确认人、确认时间是BeanUtil赋值过去的
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role","dept"));

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);

	}

	@Override
	public void pageSalesPaymentForCollect(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT), "eq") );

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForCollect(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserVO() , new SalesVO(new VillageVO(), new CustomerVO(), new UserVO(), new DepartmentVO(), new DepartmentVO(), new UserVO(), new DepartmentVO(), new UserVO()) ,new SalesReceiptVO(new UserVO()));
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPaymentPO.getSales(), salesPaymentVO.getSales(), Arrays.asList("village","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getVillage(), salesPaymentVO.getSales().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getCustomer(), salesPaymentVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesPaymentPO.getSales().getSalesman(), salesPaymentVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getDept(), salesPaymentVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getRegion(), salesPaymentVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuider(), salesPaymentVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getInstorer(), salesPaymentVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuideDept(), salesPaymentVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			//收款人、收款时间是BeanUtil赋值过去的
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);

	}

	@Override
	public void pageSalesPaymentForInit(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT), "eq") );

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserVO() , new SalesVO(new VillageVO(), new CustomerVO(), new UserVO(), new DepartmentVO(), new DepartmentVO(), new UserVO(), new DepartmentVO(), new UserVO()) ,new SalesReceiptVO());
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPaymentPO.getSales(), salesPaymentVO.getSales(), Arrays.asList("village","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getVillage(), salesPaymentVO.getSales().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getCustomer(), salesPaymentVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesPaymentPO.getSales().getSalesman(), salesPaymentVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getDept(), salesPaymentVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getRegion(), salesPaymentVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuider(), salesPaymentVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getInstorer(), salesPaymentVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPaymentPO.getSales().getGuideDept(), salesPaymentVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);

	}

}
