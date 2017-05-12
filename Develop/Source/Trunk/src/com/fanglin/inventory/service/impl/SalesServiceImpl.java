package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.inventory.dao.ColorDao;
import com.fanglin.inventory.dao.FormatDao;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.SalesItemPO;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.inventory.service.SalesService;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.inventory.vo.SalesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("salesService")
@Transactional(readOnly=true)
public class SalesServiceImpl implements SalesService {
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private SalesDao salesDao;
	
	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesItemDao salesItemDao;
	
	@Autowired
	private GoodsDao goodsDao;
	
	@Autowired
	private ColorDao colorDao;
	
	@Autowired
	private FormatDao formatDao;
	
	@Autowired
	private  VillageDao villageDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	
	@Override
	public void pageSales(Paging paging, List<Filter> filter,String userId) {
		
		
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		String duty = userPO.getDuty();
		
		String id = Integer.toString(userPO.getUid());
		if(!"管理员".equals(duty)){
			if(filter.size() == 0) return;
		}
		if("驻店导购".equals(duty)){
			filter.add(new Filter(SalesPO.COLUMN_INSTORERID_STR, id, "eq") );
		}else if("主材导购".equals(duty)){
			filter.add(new Filter(SalesPO.COLUMN_GUIDERID_STR, id, "eq") );
		}else if("管理员".equals(duty)){
			
		}else {
			filter.add(new Filter(SalesPO.COLUMN_SALESMANID_STR, id, "eq") );
		}
		
		List<SalesPO> salesPOs = salesDao.pageSales(paging, filter);
		List<SalesVO> salesVOs = new ArrayList<SalesVO>();
		
		for(SalesPO salesPO:salesPOs){
			
			SalesVO _salesVO = new SalesVO(new VillageVO(),new CustomerVO(),new UserVO(),new DepartmentVO(),new DepartmentVO(),new UserVO(),new DepartmentVO(),new UserVO());
			
			BeanUtil.copyProperties(salesPO, _salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","village","customer"));
			BeanUtil.copyProperties(salesPO.getSalesman(), _salesVO.getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPO.getDept(), _salesVO.getDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPO.getRegion(), _salesVO.getRegion(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPO.getInstorer(), _salesVO.getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPO.getGuider(), _salesVO.getGuider(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), _salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper"));
			BeanUtil.copyProperties(salesPO.getVillage(), _salesVO.getVillage(),Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(salesPO.getCustomer(), _salesVO.getCustomer());
			
			salesVOs.add(_salesVO);
		}
		
		paging.setData(salesVOs); 

	}

	@Override
	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException {
		
		SalesPO salesPO = salesDao.querySalesBySid(salesVO.getSid());
		
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesVO = new SalesVO(new VillageVO(),new CustomerVO(),new UserVO(),new DepartmentVO(),new DepartmentVO(),new UserVO(),new DepartmentVO(),new UserVO());
		
		BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","village","customer"));
		BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper"));
		BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper"));
		BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper"));
		BeanUtil.copyProperties(salesPO.getVillage(), salesVO.getVillage(),Arrays.asList("cityProper","buildingNameRule"));
		BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
		
		return salesVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSales(SalesVO salesVO,List<SalesItemVO> salesItemVOs) throws FLException {
		
		SalesPO salesPO = new SalesPO(new VillagePO(), new CustomerPO(), new UserPO(), new DepartmentPO(), new DepartmentPO(), new UserPO(), new DepartmentPO(), new UserPO());
		
		String salesBrand = salesVO.getBrand();
		String salesItemBrand = "";
		
		UserPO salesman = userDao.get(salesVO.getSalesman().getUserId());
		UserPO guider = userDao.get(salesVO.getGuider().getUserId());
		UserPO instorer = userDao.get(salesVO.getInstorer().getUserId());
		
		String currentDate = DateUtil.current("yyyyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT , currentDate);
		
		String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
		
			
		BeanUtil.copyProperties(salesVO, salesPO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","village","customer"));
		BeanUtil.copyProperties(salesman, salesPO.getSalesman(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(salesman.getDept(), salesPO.getDept(),Arrays.asList("fatherDept","cityProper"));
		BeanUtil.copyProperties(salesman.getDept().getFatherDept(), salesPO.getRegion(),Arrays.asList("fatherDept","cityProper"));
		BeanUtil.copyProperties(instorer, salesPO.getInstorer(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(guider, salesPO.getGuider(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(guider.getDept(), salesPO.getGuideDept(),Arrays.asList("fatherDept","cityProper"));
		BeanUtil.copyProperties(villageDao.get(salesVO.getVillage().getVillageId()), salesPO.getVillage(),Arrays.asList("cityProper","buildingNameRule"));
		BeanUtil.copyProperties(customerDao.queryCustomerByCustomerId(salesVO.getCustomer().getCustomerId()), salesPO.getCustomer());
		salesPO.setNo(no);
		salesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));;
			
		salesDao.save(salesPO);
		
		salesVO.setSid(salesPO.getSid());
		
		for(SalesItemVO salesItemVO: salesItemVOs){
			
			BeanUtil.copyProperties(goodsDao.get(salesItemVO.getGoods().getGid()), salesItemVO.getGoods(),Arrays.asList("assisType"));
			
			if(salesItemBrand == null || "".equals(salesItemBrand)){
				
				salesItemBrand = salesItemVO.getGoods().getBrand();
				if(!salesItemBrand.equals(salesBrand)){
					throw new FLException(111, "品牌不一致");
				}
			}
			
			if(!salesItemBrand.equals(salesItemVO.getGoods().getBrand())){
				throw new FLException(111, "品牌不一致");
			}
			
			SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(), new ColorPO(), new FormatPO());
			
			BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(salesItemVO.getGoods(), salesItemPO.getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyProperties(colorDao.get(salesItemVO.getColor().getCid()), salesItemPO.getColor());
			BeanUtil.copyProperties(formatDao.get(salesItemVO.getFormat().getFid()), salesItemPO.getFormat());
			
			salesItemPO.setSid(salesVO.getSid());
			salesPO.setTotal(salesVO.getTotal());
			salesDao.update(salesPO);
			
			salesItemDao.save(salesItemPO);
			
		}
		
		salesVO.setSid(salesPO.getSid());
				
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesForCoupon(SalesVO salesVO) throws FLException {
		
		SalesPO salesPO = salesDao.querySalesBySid(salesVO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesPO.setCoupon(salesVO.getCoupon());
		salesPO.setCouponInfo(salesVO.getCouponInfo());
		
		salesDao.update(salesPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesForMaling(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.querySalesBySid(salesVO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesPO.setVenderMaling(salesVO.getVenderMaling());
		
		salesDao.update(salesPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesForPaymentStatus(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.querySalesBySid(salesVO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		//salesPO.setPaymentStatus(salesVO.getPaymentStatus());
		
		salesDao.update(salesPO);
		
		return 0;
	}
	
	

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesConfirmSalesPaymentStatus(List<SalesVO> salesVOs) throws FLException {

		for(SalesVO salesVO: salesVOs){
			SalesPO salesPO = salesDao.querySalesBySid(salesVO.getSid());
			
			if(salesPO == null){
				throw new FLException(260021, "销售单不存在");
			}
			
			//salesPO.setPaymentStatus(SalesPO.PAYMENTSTATUS_CONFIRMSALESPAYMENT_SHORT);
			
			salesDao.update(salesPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesStatusWaste(SalesPO salesPO) throws FLException {

		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesPO.setStatus(SalesPO.STATUS_WAST_SHORT);
		
		salesDao.update(salesPO);
		
		return 0;
	}
	
}
