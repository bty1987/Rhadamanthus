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
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("salesPaymentService")
@Transactional(readOnly=true)
public class SalesPaymentServiceImpl implements SalesPaymentService{

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesReceiptDao salesReceiptDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageSalesPaymentForInit(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT), "eq") );

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){
			
			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO());
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesVO = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));

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

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO(new UserBaseVO()));
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesVO = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept","duty"));

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

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO(new UserBaseVO(),new UserBaseVO()));
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesVO = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role","dept","duty"));

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);

	}
	
	@Override
	public void pageSalesPaymentForNotInit(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT), "ne") );

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForNotInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO(new UserBaseVO(),new UserBaseVO()));
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesVO = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role","dept","duty"));

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);

	}
	
	@Override
	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(salesPaymentVO.getSales().getSid());
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();


		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO());
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesVO = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}
	
	@Override                  
	public List<SalesPaymentVO> querySalesPaymentForNotInitBySrid(SalesReceiptVO salesReceipt) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentForNotInitBySrid(salesReceipt.getSrId());

		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for(SalesPaymentPO salesPaymentPO: salesPaymentPOs){

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO(new UserBaseVO(),new UserBaseVO()));
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesVO = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role","dept","duty"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}
	
	
	@Override
	public List<SalesPaymentVO> querySalesPaymentByOrderId(SalesVO salesVO) {
		
		List<SalesPO> salesPOs = salesDao.querySalesByOrderId(salesVO.getOrderId());
		
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();
		
		if(salesPOs == null || salesPOs.size() == 0){
			return salesPaymentVOs;
		}
		
		List<Long> sids = new ArrayList<Long>();
		
		for(SalesPO sales : salesPOs){
			sids.add(sales.getSid());
		}
		
		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentBySids(sids);
		
		
		SalesPaymentVO salesPaymentVO;
		
		for(SalesPaymentPO salesPaymentPO : salesPaymentPOs){
			salesPaymentVO = new SalesPaymentVO(new UserBaseVO() , new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()) ,new SalesReceiptVO(new UserBaseVO(),new UserBaseVO()));
			SalesPO salesPO = salesPaymentPO.getSales();
			SalesVO salesV = salesPaymentVO.getSales();
			BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater","sales","salesReceipt"));
			salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
			BeanUtil.copyProperties(salesPO, salesV, Arrays.asList("house","customer","salesman","dept","region","guider","instorer","guideDept"));
			BeanUtil.copyProperties(salesPO.getHouse(), salesV.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesV.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), salesV.getCustomer());
			BeanUtil.copyProperties(salesPO.getSalesman(), salesV.getSalesman(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), salesV.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), salesV.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getGuider(), salesV.getGuider(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getInstorer(), salesV.getInstorer(),Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), salesV.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter","confirmer"));
		
			salesPaymentVOs.add(salesPaymentVO);
		}
		
		return salesPaymentVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSalesPayment(SalesPaymentVO salesPaymentVO,String cuid) throws FLException {

		SalesPO sales = salesDao.get(salesPaymentVO.getSales().getSid());

	    if (sales == null) {
	      throw new FLException(260021, "销售单不存在");
	    }

	    if (sales.getStatus() != 0) {
	      throw new FLException(260022, "销售单状态不可操作");
	    }

	    if (salesPaymentDao.countSalesPaymentBySidAType(salesPaymentVO.getSales().getSid(), salesPaymentVO.getType()) > 0) {
	      throw new FLException(150033, "款项类型已存在");
	    }
	    
	    if(salesPaymentVO.getType() == SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT){
	    	
	    	List<SalesPaymentPO> salesPayments = salesPaymentDao.querySalesPaymentsBySid(salesPaymentVO.getSales().getSid());

	    	if(salesPayments.size() == 1){
	    		SalesPaymentPO salesPayment = salesPayments.get(0);
				
				if(salesPayment.getStatus() == SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
					throw new FLException(150029, "款项不可提交");
				}
			}
	    }
	    
	    
	    if(salesPaymentVO.getType() == SalesPaymentPO.COLUMN_DEPOSITTYPE_INT){
	    	
	    	if (salesPaymentDao.countSalesPaymentBySidAType(salesPaymentVO.getSales().getSid(), SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT) > 0){
	  	      throw new FLException(150033, "补款已提交");
	  	    }

	    }
	    
	    
	    SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

	    BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList( "sales", "collecter", "confirmer" ));
	    BeanUtil.copyProperties(salesDao.get(salesPaymentVO.getSales().getSid()), salesPaymentPO.getSales(), Arrays.asList("house", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept"));
	    UserPO userPO = userDao.queryUserByUserId(cuid);
	    salesPaymentPO.setCreater(userPO);
	    salesPaymentPO.setCreaterName(userPO.getUserName());
	    salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
	    salesPaymentPO.setType(salesPaymentVO.getType());
	    salesPaymentPO.setBrand(sales.getBrand());
	    salesPaymentPO.setCategory(sales.getCategory());

	    salesPaymentDao.save(salesPaymentPO);

	    salesPaymentVO.setSpid(salesPaymentPO.getSpid());

	    if(salesPaymentPO.getType() == SalesPO.STATUS_ALLBACK_SHORT){
	      sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_UNPAY_SHORT);
	      salesDao.update(sales);
	    }else if(salesPaymentPO.getType() == SalesPO.STATUS_DBACKORDER_SHORT){
	      sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_UNPAY_SHORT);
	      salesDao.update(sales);
	    }

	    return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectSalesPayment(SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException {
		
		SalesPO sales = salesDao.get(salesPaymentVO.getSales().getSid());

	    if (sales == null) {
	      throw new FLException(260021, "销售单不存在");
	    }

		if (salesPaymentDao.countSalesPaymentBySid(salesPaymentVO.getSales().getSid()) < 0) {
			throw new FLException(150003, "款项不存在");
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		
		salesReceiptPO.setCollecter(userPO);
		salesReceiptPO.setCollecterName(userPO.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		salesReceiptPO.setRealMoney(salesReceiptVO.getRealMoney());

		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getInstallment() != null) {
			salesReceiptPO.setInstallment(salesReceiptVO.getInstallment());
			salesReceiptPO.setInstallBank(salesReceiptVO.getInstallBank());
		} else {
			salesReceiptPO.setInstallment(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setInstallBank("");
		}

		if (salesReceiptVO.getAccounts() != null) {
			salesReceiptPO.setAccounts(salesReceiptVO.getAccounts());
			salesReceiptPO.setAccountsBank(salesReceiptVO.getAccountsBank());
		} else {
			salesReceiptPO.setAccounts(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAccountsBank("");
		}

		if (salesReceiptVO.getCoupon() != null) {
			salesReceiptPO.setCoupon(salesReceiptVO.getCoupon());
			salesReceiptPO.setCouponInfo(salesReceiptVO.getCouponInfo());
		} else {
			salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCouponInfo("");
		}

		if (salesReceiptVO.getAdvance() != null) {
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_INT);
		}

		if (salesReceiptVO.getComment() != null)
			salesReceiptPO.setComment(salesReceiptVO.getComment());
		else {
			salesReceiptPO.setComment("");
		}
		
		salesReceiptPO.setType(SalesReceiptPO.COLUMN_SALESRECEIPT_TYPE_INT);

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts() + salesReceiptPO.getCoupon() + salesReceiptPO.getAdvance();
		Float referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);

		salesPayment.setSalesReceipt(salesReceiptPO);

		salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		salesPaymentDao.update(salesPayment);
		
		SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());
		if (salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {
			salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);
			salesDao.update(salesPO);
		} else if (salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			salesPO.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			salesDao.update(salesPO);
		}
		
		
		if(salesPaymentVO.getAdvanceType() != null){
			
			String paymentType = "";
			
			if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPECONTRACT_INT){
				paymentType = "合同预付款";
			}else if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEENGINEERING_INT){
				paymentType = "工程预付款";
			}else if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEMATERIAL_INT){
				paymentType = "主材预付款";
			}else if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEZHENGLIN_INT){
				paymentType = "正林预付款";
			}
			
			PaymentVO paymentVO  = new PaymentVO();
			
			paymentVO.setOrderId(sales.getOrderId());
			paymentVO.setPaymentType(paymentType);
			paymentVO.setComment("InventoryPayPayment");
			paymentVO.setCash(salesPaymentVO.getAdvance());
			
			paymentService.payPayment(paymentVO, userId);
			
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectSalesPayments(List<Long> spids,SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException {
		
		SalesPO sales = salesDao.get(salesPaymentVO.getSales().getSid());

	    if (sales == null) {
	      throw new FLException(260021, "销售单不存在");
	    }

		if (salesPaymentDao.countSalesPaymentBySid(salesPaymentVO.getSales().getSid()) < 0) {
			throw new FLException(150003, "款项不存在");
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		
		salesReceiptPO.setCollecter(userPO);
		salesReceiptPO.setCollecterName(userPO.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getInstallment() != null) {
			salesReceiptPO.setInstallment(salesReceiptVO.getInstallment());
			salesReceiptPO.setInstallBank(salesReceiptVO.getInstallBank());
		} else {
			salesReceiptPO.setInstallment(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setInstallBank("");
		}

		if (salesReceiptVO.getAccounts() != null) {
			salesReceiptPO.setAccounts(salesReceiptVO.getAccounts());
			salesReceiptPO.setAccountsBank(salesReceiptVO.getAccountsBank());
		} else {
			salesReceiptPO.setAccounts(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAccountsBank("");
		}

		if (salesReceiptVO.getAdvance() != null) {
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_INT);
		}

		if (salesReceiptVO.getComment() != null)
			salesReceiptPO.setComment(salesReceiptVO.getComment());
		else {
			salesReceiptPO.setComment("");
		}
		salesReceiptPO.setRealMoney(salesReceiptVO.getRealMoney());

		salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_COUPON_INT);
		salesReceiptPO.setCouponInfo("");
		
		salesReceiptPO.setType(SalesReceiptPO.COLUMN_SALESRECEIPT_TYPE_INT);

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts() + salesReceiptPO.getAdvance();

		Float referMoneyPY = 0f;
		for (Long spid : spids) {
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			referMoneyPY = referMoneyPY + salesPayment.getReferMoney();
		}

		if (Arith.sub(referMoneySR, referMoneyPY) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);

		for (Long spid : spids){
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			salesPayment.setSalesReceipt(salesReceiptPO);
			salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
			salesPaymentDao.update(salesPayment);

			SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());

			if(salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT){
				
				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);
				
				salesDao.update(salesPO);
				
			}else if(salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT){
				
				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
				salesPO.setFullpayTime(new Timestamp(System.currentTimeMillis()));
				salesDao.update(salesPO);
				
			} 
		}
		
		if(salesPaymentVO.getAdvanceType() != null){
			
			String paymentType = "";
			
			if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPECONTRACT_INT){
				paymentType = "合同预付款";
			}else if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEENGINEERING_INT){
				paymentType = "工程预付款";
			}else if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEMATERIAL_INT){
				paymentType = "主材预付款";
			}else if(salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEZHENGLIN_INT){
				paymentType = "正林预付款";
			}
			
			PaymentVO paymentVO  = new PaymentVO();
			
			paymentVO.setOrderId(sales.getOrderId());
			paymentVO.setPaymentType(paymentType);
			paymentVO.setComment("InventoryPayPayment");
			paymentVO.setCash(salesPaymentVO.getAdvance());
			
			paymentService.payPayment(paymentVO, userId);
			
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectSalesPaymentForRefund(SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException {

		SalesPO sales = salesDao.get(salesPaymentVO.getSales().getSid());

		if (sales == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPaymentDao.countSalesPaymentBySid(salesPaymentVO.getSales().getSid()) < 0) {
			throw new FLException(150003, "款项不存在");
		}

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		UserPO user = userDao.queryUserByUserId(userId);
		salesReceiptPO.setCollecter(user);
		salesReceiptPO.setCollecterName(user.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getInstallment() != null) {
			salesReceiptPO.setInstallment(salesReceiptVO.getInstallment());
			salesReceiptPO.setInstallBank(salesReceiptVO.getInstallBank());
		} else {
			salesReceiptPO.setInstallment(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setInstallBank("");
		}

		if (salesReceiptVO.getAccounts() != null) {
			salesReceiptPO.setAccounts(salesReceiptVO.getAccounts());
			salesReceiptPO.setAccountsBank(salesReceiptVO.getAccountsBank());
		} else {
			salesReceiptPO.setAccounts(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAccountsBank("");
		}

		if (salesReceiptVO.getAdvance() != null) {
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_INT);
		}
		
		if (salesReceiptVO.getCoupon() != null) {
			salesReceiptPO.setCoupon(salesReceiptVO.getCoupon());
			salesReceiptPO.setCouponInfo(salesReceiptVO.getCouponInfo());
		} else {
			salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_COUPON_INT);
			salesReceiptPO.setCouponInfo("");
		}

		if (salesReceiptVO.getComment() != null)
			salesReceiptPO.setComment(salesReceiptVO.getComment());
		else {
			salesReceiptPO.setComment("");
		}
		
		salesReceiptPO.setRealMoney(salesReceiptVO.getRealMoney());
		
		salesReceiptPO.setType(SalesReceiptPO.COLUMN_SALESRECEIPT_REFUND_TYPE_INT);

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts() + salesReceiptPO.getCoupon();
		Float referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);

		salesPayment.setSalesReceipt(salesReceiptPO);

		salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		salesPaymentDao.update(salesPayment);

		if (salesPayment.getType() == SalesPaymentPO.COLUMN_MAKEAREFUNDTYPE_INT){
			
			sales.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			
			salesDao.update(sales);
			
		}

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
			UserPO user = userDao.queryUserByUserId(userId);
			salesReceiptPO.setConfirmer(user);
			salesReceiptPO.setConfirmerName(user.getUserName());
			salesReceiptDao.update(salesReceiptPO);

			SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());

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
	public int cancelSalesPayment(SalesPaymentVO salesPaymentVO) throws FLException{

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());
		
		if (salesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}


		if(salesPayment.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
			throw new FLException(150019, "款项不能撤销");
		}

		SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());

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
	public int refundSalesPayment(SalesPaymentVO salesPaymentVO,String cuid) throws FLException{

		SalesPO sales = salesDao.get(salesPaymentVO.getSales().getSid());

		if (sales == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (sales.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPaymentDao.countSalesPaymentBySidAType(salesPaymentVO.getSales().getSid(), salesPaymentVO.getType()) > 0) {
			throw new FLException(150033, "款项类型已存在");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList("sales", "collecter", "confirmer"));
		BeanUtil.copyProperties(salesDao.get(salesPaymentVO.getSales().getSid()), salesPaymentPO.getSales(), Arrays.asList("village", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept" ));
		UserPO userPO = userDao.queryUserByUserId(cuid);
		salesPaymentPO.setCreater(userPO);
		salesPaymentPO.setCreaterName(userPO.getUserName());
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
		salesPaymentPO.setType(salesPaymentVO.getType());
		salesPaymentPO.setBrand(sales.getBrand());
		salesPaymentPO.setCategory(sales.getCategory());
		
		if(salesPaymentVO.getType() == SalesPaymentPO.COLUMN_DEPOSITREFUNDTYPE_INT){
			sales.setStatus(SalesPO.STATUS_WAST_SHORT);
			salesDao.update(sales);
		}else if (salesPaymentVO.getType() == SalesPaymentPO.COLUMN_MAKEAREFUNDTYPE_INT){
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_UNPAY_SHORT);
			salesDao.update(sales);
		}

		salesPaymentDao.save(salesPaymentPO);

		salesPaymentVO.setSpid(salesPaymentPO.getSpid());
		
		return 0;
	}
	
}
