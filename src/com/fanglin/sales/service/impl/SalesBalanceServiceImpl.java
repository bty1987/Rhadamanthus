package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.dao.SalesBalanceItemDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesBalanceItemPO;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.vo.RefundsVO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("salesBalanceService")
@Transactional(readOnly=true)
public class SalesBalanceServiceImpl implements SalesBalanceService{
	
	@Autowired
	private SalesBalanceDao salesBalanceDao;
	
	@Autowired
	private SalesDao salesDao;
	
	@Autowired
	private SalesItemDao salesItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SalesBalanceItemDao salesBalanceItemDao; 
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Override
	public List<SalesBalanceVO> pageSalesBalance(List<SalesBalancePO> salesBalancePOs) {
		
		List<SalesBalanceVO> salesBalanceVOs = new ArrayList<SalesBalanceVO>();
		
		for(SalesBalancePO salesBalancePO:salesBalancePOs){
					
			SalesBalanceVO salesBalanceVO = new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO()), new RefundsVO(), new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyPropertie(salesBalancePO, salesBalanceVO, Arrays.asList("sales","refunds","creater","poster"));
			BeanUtil.copyPropertie(salesBalancePO.getSales(), salesBalanceVO.getSales(), Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getSalesman(), salesBalanceVO.getSales().getSalesman(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getDept(), salesBalanceVO.getSales().getDept(),Arrays.asList("fatherDept","type","manager"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getRegion(), salesBalanceVO.getSales().getRegion(),Arrays.asList("fatherDept","type","manager"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getInstorer(), salesBalanceVO.getSales().getInstorer(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getGuider(), salesBalanceVO.getSales().getGuider(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getGuideDept(), salesBalanceVO.getSales().getGuideDept(),Arrays.asList("fatherDept","type","manager"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getHouse(), salesBalanceVO.getSales().getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getHouse().getVillage(), salesBalanceVO.getSales().getHouse().getVillage(),Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getCustomer(), salesBalanceVO.getSales().getCustomer());
			BeanUtil.copyPropertie(salesBalancePO.getRefunds(), salesBalanceVO.getRefunds(), Arrays.asList("creater"));
			BeanUtil.copyPropertie(salesBalancePO.getCreater(), salesBalanceVO.getCreater(), Arrays.asList("dept","duty"));
			BeanUtil.copyPropertie(salesBalancePO.getPoster(), salesBalanceVO.getPoster(), Arrays.asList("dept","duty"));
			
			salesBalanceVOs.add(salesBalanceVO);
		}
		
		return salesBalanceVOs;
	}
	
	@Override
	public void pageSalesBalance(Paging paging, List<Filter> filters,int company) {
		
		if(filters.size() == 0) return;
		
		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalance(paging, filters,company);
		
		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);
		
		paging.setData(salesBalanceVOs); 
		
	}
	
	@Override
	public void pageSalesBalanceForDompany(Paging paging, List<Filter> filters,int dompany) {
		
		if(filters.size() == 0) return;
		
		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalanceForDompany(paging, filters, dompany);
		
		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);
		
		paging.setData(salesBalanceVOs); 
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesBalanceForVBalance(SalesBalanceVO salesBalanceVO)throws FLException {
		
		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());
		
		if(salesBalancePO == null){
			throw new FLException(260037, "销售结算信息不存在");
		}
		
		if(salesBalancePO.getStatus() != SalesBalancePO.STATUS_PREBALANCE_INT){
			throw new FLException(260038, "销售结算状态不可操作");
		}
		
		salesBalancePO.setVbalance(salesBalanceVO.getVbalance());
		
		salesBalanceDao.update(salesBalancePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesBalanceForPBalance(SalesBalanceVO salesBalanceVO)throws FLException {
		
		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());
		
		if(salesBalancePO == null){
			throw new FLException(260037, "销售结算信息不存在");
		}
		
		if(salesBalancePO.getStatus() != SalesBalancePO.STATUS_VENDORBALANCE_INT){
			throw new FLException(260038, "销售结算状态不可操作");
		}
		
		salesBalancePO.setPbalance(salesBalanceVO.getPbalance());
		
		salesBalanceDao.update(salesBalancePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int passSalesBalance(List<Long> sids) throws FLException {
		
		for(long sid : sids){
			
			SalesPO salesPO = salesDao.get(sid);
			
			if(salesPO == null){
				throw new FLException(260021, "销售单不存在");
			}
			
			if(salesPO.getStatus()!=SalesPO.STATUS_INIT_SHORT){
				throw new FLException(260022, "销售单状态不可操作");
			}
			
			salesPO.setStatus(SalesPO.STATUS_END_SHORT);
			
			salesDao.update(salesPO);
			
		}
		
		return 0;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int preSalesBalance(List<Long> sids,String userId) throws FLException {
		
		for(long sid : sids){
			
			SalesPO salesPO = salesDao.get(sid);
			
			if(salesPO == null){
				throw new FLException(260021, "销售单不存在");
			}
			
			if(salesPO.getStatus()!=SalesPO.STATUS_INIT_SHORT){
				throw new FLException(260022, "销售单状态不可操作");
			}
			
			if(salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT){
				throw new FLException(260022, "销售单状态不可操作");
			}
			
			ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(sid));
			
			if(approvalPO != null){
				throw new FLException(240007, "存在未处理审批信息");
			}
			
			SalesBalancePO salesBalancePO = new SalesBalancePO();
			
			UserPO userPO = userDao.queryUserByUserId(userId);
			
			float balance = 0f;
			
			salesBalancePO.setSales(salesPO);
			salesBalancePO.setCreater(userPO);
			salesBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesBalancePO.setTotal(salesPO.getTotal());
			salesBalancePO.setBalance(balance);
			salesBalancePO.setVbalance(0f);
			salesBalancePO.setPbalance(0f);
			salesBalancePO.setType(SalesBalancePO.TYPE_INIT_INT);
			salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
			salesBalancePO.setComment(salesPO.getComment());
			
			salesBalanceDao.save(salesBalancePO);
			
			List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesPO.getSid());
			
			for(SalesItemPO salesItemPO : salesItemPOs){
				
				float _price = salesItemPO.getPrice();
				float _disPrice = salesItemPO.getDisPrice();
				
				if(salesItemPO.getCtype() == SalesItemPO.CTYPE_POINT_INT){
					float _balance = Arith.mul(Arith.sub(_price, Arith.mul(_disPrice, Arith.sub(1f, salesItemPO.getCvalue()))), salesItemPO.getNum());
					balance = Arith.add(balance, _balance);
				}
				
				if(salesItemPO.getCtype() == SalesItemPO.CTYPE_RESERVEPRICE_INT){
					float _balance = Arith.mul(Arith.sub(_price, salesItemPO.getCvalue()),salesItemPO.getNum());
					balance = Arith.add(balance, _balance);
				}
				
				SalesBalanceItemPO salesBalanceItemPO = new SalesBalanceItemPO();
				salesBalanceItemPO.setSbid(salesBalancePO.getSbid());
				salesBalanceItemPO.setSalesItem(salesItemPO);
				salesBalanceItemPO.setRawCtype(salesItemPO.getRawCtype());
				salesBalanceItemPO.setRawCvalue(salesItemPO.getRawCvalue());
				salesBalanceItemPO.setCtype(salesItemPO.getCtype());
				salesBalanceItemPO.setCvalue(salesItemPO.getCvalue());
				salesBalanceItemPO.setNum(salesItemPO.getNum());
				salesBalanceItemPO.setTotal(salesItemPO.getTotal());
				
				salesBalanceItemDao.save(salesBalanceItemPO);
				
			}
			
			salesBalancePO.setBalance(balance);
			salesBalancePO.setDifference(Arith.sub(salesBalancePO.getTotal(), balance));
			
			salesBalanceDao.update(salesBalancePO);
			
			salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT);
			
			salesDao.update(salesPO);
			
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int vpostSalesBalance(SalesBalanceVO salesBalanceVO)throws FLException {
		
		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());
		
		if(salesBalancePO == null){
			throw new FLException(260037, "销售结算信息不存在");
		}
		
		if(salesBalancePO.getStatus()!=SalesBalancePO.STATUS_PREBALANCE_INT){
			throw new FLException(260038 ,"销售结算状态不可操作");
		}
		
		SalesPO salesPO = salesDao.get(salesBalancePO.getSales().getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getStatus() == SalesPO.STATUS_END_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		salesBalancePO.setStatus(SalesBalancePO.STATUS_VENDORBALANCE_INT);
		salesBalancePO.setVenderTime(DateUtil.getDateToTimestamp(new Date()));
		
		salesBalanceDao.update(salesBalancePO);
		
		salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_VENDORSETTLEMENT_SHORT);
		
		salesDao.update(salesPO);
		
		return 0;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int postSalesBalance(SalesBalanceVO salesBalanceVO,String userId)throws FLException {
		
		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());
		
		if(salesBalancePO == null){
			throw new FLException(260037, "销售结算信息不存在");
		}
		
		if(salesBalancePO.getStatus()!=SalesBalancePO.STATUS_VENDORBALANCE_INT){
			throw new FLException(260038 ,"销售结算状态不可操作");
		}
		
		SalesPO salesPO = salesDao.get(salesBalancePO.getSales().getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getStatus() == SalesPO.STATUS_END_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		UserPO poster = userDao.queryUserByUserId(userId);
		
		salesBalancePO.setStatus(SalesBalancePO.STATUS_BALANCE_INT);
		salesBalancePO.setPoster(poster);
		salesBalancePO.setPostTime(DateUtil.getDateToTimestamp(new Date()));
		
		salesBalanceDao.update(salesBalancePO);
		
		salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_SETTLEMENT_SHORT);
		salesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
		
		salesDao.update(salesPO);
		
		return 0;
		
	}

}
