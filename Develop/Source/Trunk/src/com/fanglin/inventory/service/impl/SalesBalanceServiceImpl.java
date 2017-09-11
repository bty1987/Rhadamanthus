package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.inventory.dao.SalesBalanceDao;
import com.fanglin.inventory.dao.SalesBalanceItemDao;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.inventory.po.SalesBalanceItemPO;
import com.fanglin.inventory.po.SalesBalancePO;
import com.fanglin.inventory.po.SalesItemPO;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.inventory.service.SalesBalanceService;
import com.fanglin.inventory.vo.RefundsVO;
import com.fanglin.inventory.vo.SalesBalanceVO;
import com.fanglin.inventory.vo.SalesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
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
	
	@Override
	public void pageSalesBalance(Paging paging, List<Filter> filters) {
		
		if(filters.size() == 0) return;
		
		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalance(paging, filters);
		List<SalesBalanceVO> salesBalanceVOs = new ArrayList<SalesBalanceVO>();
		
		for(SalesBalancePO salesBalancePO:salesBalancePOs){
			
			SalesBalanceVO salesBalanceVO = new SalesBalanceVO(new SalesVO(new VillageVO(),new CustomerVO(),new UserVO(),new DepartmentVO(),new DepartmentVO(),new UserVO(),new DepartmentVO(),new UserVO()), new RefundsVO(), new UserVO(), new UserVO());
			
			BeanUtil.copyPropertie(salesBalancePO, salesBalanceVO, Arrays.asList("sales","refunds","creater","poster"));
			BeanUtil.copyPropertie(salesBalancePO.getSales(), salesBalanceVO.getSales(), Arrays.asList("salesman","dept","region","guider","instorer","guideDept","village","customer"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getSalesman(), salesBalanceVO.getSales().getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getDept(), salesBalanceVO.getSales().getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getRegion(), salesBalanceVO.getSales().getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getInstorer(), salesBalanceVO.getSales().getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getGuider(), salesBalanceVO.getSales().getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getGuideDept(), salesBalanceVO.getSales().getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getVillage(), salesBalanceVO.getSales().getVillage(),Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesBalancePO.getSales().getCustomer(), salesBalanceVO.getSales().getCustomer());
			BeanUtil.copyPropertie(salesBalancePO.getRefunds(), salesBalanceVO.getRefunds(), Arrays.asList("creater"));
			BeanUtil.copyPropertie(salesBalancePO.getCreater(), salesBalanceVO.getCreater(), Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyPropertie(salesBalancePO.getPoster(), salesBalanceVO.getPoster(), Arrays.asList("role","dept","contracts","experiences"));
			
			salesBalanceVOs.add(salesBalanceVO);
		}
		
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
			
			SalesPO salesPO = salesDao.querySalesBySid(sid);
			
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
			
			SalesPO salesPO = salesDao.querySalesBySid(sid);
			
			if(salesPO == null){
				throw new FLException(260021, "销售单不存在");
			}
			
			if(salesPO.getStatus()==SalesPO.STATUS_END_SHORT){
				throw new FLException(260022, "销售单状态不可操作");
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
		
		SalesPO salesPO = salesDao.querySalesBySid(salesBalancePO.getSales().getSid());
		
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
		
		SalesPO salesPO = salesDao.querySalesBySid(salesBalancePO.getSales().getSid());
		
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
