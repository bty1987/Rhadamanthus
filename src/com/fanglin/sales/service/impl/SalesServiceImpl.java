package com.fanglin.sales.service.impl;

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
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.HousePO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

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
	
	@Override
	public void pageSales(Paging paging, List<Filter> filter,String userId,int company) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		Integer id = userPO.getUid();
		
		List<SalesPO> salesPOs = salesDao.pageSales(paging, filter,company,id);
		List<SalesVO> salesVOs = new ArrayList<SalesVO>();
		
		for(SalesPO salesPO:salesPOs){
			
			SalesVO _salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(salesPO, _salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
			BeanUtil.copyProperties(salesPO.getSalesman(), _salesVO.getSalesman(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), _salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), _salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getInstorer(), _salesVO.getInstorer(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuider(), _salesVO.getGuider(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), _salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getHouse(), _salesVO.getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), _salesVO.getHouse().getVillage(),Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), _salesVO.getCustomer());
			
			salesVOs.add(_salesVO);
		}
		
		paging.setData(salesVOs); 

	}
	
	@Override
	public void pageSalesForAdvance(Paging paging, List<Filter> filter,String userId,int company) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<SalesPO> salesPOs = salesDao.pageSalesForAdvance(paging, filter, company);
		List<SalesVO> salesVOs = new ArrayList<SalesVO>();
		
		for(SalesPO salesPO:salesPOs){
			
			SalesVO _salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(salesPO, _salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
			BeanUtil.copyProperties(salesPO.getSalesman(), _salesVO.getSalesman(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), _salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), _salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getInstorer(), _salesVO.getInstorer(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuider(), _salesVO.getGuider(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), _salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getHouse(), _salesVO.getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), _salesVO.getHouse().getVillage(),Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), _salesVO.getCustomer());
			
			salesVOs.add(_salesVO);
		}
		
		paging.setData(salesVOs); 

	}
	
	@Override
	public void pageSalesForBalance(Paging paging, List<Filter> filter,String userId, int company) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<SalesPO> salesPOs = salesDao.pageSalesForBalance(paging, filter,company);
		List<SalesVO> salesVOs = new ArrayList<SalesVO>();
		
		for(SalesPO salesPO:salesPOs){
			
			SalesVO _salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(salesPO, _salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
			BeanUtil.copyProperties(salesPO.getSalesman(), _salesVO.getSalesman(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), _salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getRegion(), _salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getInstorer(), _salesVO.getInstorer(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuider(), _salesVO.getGuider(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), _salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
			BeanUtil.copyProperties(salesPO.getHouse(), _salesVO.getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), _salesVO.getHouse().getVillage(),Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), _salesVO.getCustomer());
			
			salesVOs.add(_salesVO);
		}
		
		paging.setData(salesVOs); 
		
	}

	@Override
	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException{
		
		SalesPO salesPO = salesDao.get(salesVO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
		
		BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
		BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(),Arrays.asList("village"));
		BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(),Arrays.asList("cityProper"));
		BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
		
		return salesVO;
	}
	
	@Override
	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.querySalesByNo(salesVO.getNo());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}

		salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
		
		BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
		BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(),Arrays.asList("village"));
		BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(),Arrays.asList("cityProper"));
		BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
		
		return salesVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSales(SalesVO salesVO,List<SalesItemVO> salesItemVOs,int company) throws FLException {
		
		int dompany;
		
		try {
			
			dompany = FormatUtil.decodeCompany(AESHelper.decryptString(salesVO.getDompanys(), SystemConfig.getString("encryptKey")));
			
		} catch (Exception e) {
			
			throw new FLException(230015 , "公司不存在");
			
		}
			
		SalesPO salesPO = new SalesPO(new HousePO(), new CustomerPO(), new UserPO(), new DepartmentPO(), new DepartmentPO(), new UserPO(), new DepartmentPO(), new UserPO());
		
		String salesBrand = salesVO.getBrand();
		
		UserPO salesman = userDao.queryUserByUserId(salesVO.getSalesman().getUserId());
		UserPO guider = userDao.queryUserByUserId(salesVO.getGuider().getUserId());
		UserPO instorer = userDao.queryUserByUserId(salesVO.getInstorer().getUserId());
		
		String currentDate = DateUtil.current("yyyyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT , currentDate);
		
		String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
		
		BeanUtil.copyProperties(salesVO, salesPO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer","maling","venderMaling","depositpayStatus","fullpayStatus"));
		BeanUtil.copyProperties(salesman, salesPO.getSalesman(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesman.getDept(), salesPO.getDept(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(salesman.getDept().getFatherDept(), salesPO.getRegion(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(instorer, salesPO.getInstorer(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(guider, salesPO.getGuider(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(guider.getDept(), salesPO.getGuideDept(),Arrays.asList("fatherDept","cityProper","type"));
		BeanUtil.copyProperties(new HousePO(salesVO.getHouse().getHid()), salesPO.getHouse(),Arrays.asList("village"));
		BeanUtil.copyProperties(new CustomerPO(salesVO.getCustomer().getCid()), salesPO.getCustomer());
		salesPO.setMaling(0);
		salesPO.setVenderMaling(salesVO.getMaling());
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);
		salesPO.setNo(no);
		salesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPO.setCompany(company);
		salesPO.setDompany(dompany);
			
		salesDao.save(salesPO);
		
		if(salesItemVOs != null && salesItemVOs.size()!=0){
			
			for(SalesItemVO salesItemVO: salesItemVOs){
				
				GoodsPO goodsPO = goodsDao.get(salesItemVO.getGoods().getGid());
					
				if(!goodsPO.getBrand().equals(salesBrand)){
					throw new FLException(260033, "品牌不一致");
				}
				
				SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(), new ColorPO(), new FormatPO());
				
				BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods","color","format"));
				BeanUtil.copyProperties(salesItemVO.getGoods(), salesItemPO.getGoods(),Arrays.asList("accessoriesType"));
				BeanUtil.copyProperties(salesItemVO.getColor(), salesItemPO.getColor());
				BeanUtil.copyProperties(salesItemVO.getFormat(), salesItemPO.getFormat());
				
				salesItemPO.setSid(salesPO.getSid());
				
				salesItemDao.save(salesItemPO);
				
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesForCoupon(SalesVO salesVO) throws FLException {
		
		SalesPO salesPO = salesDao.get(salesVO.getSid());
		
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

		SalesPO salesPO = salesDao.get(salesVO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesPO.setVenderMaling(salesVO.getVenderMaling());
		
		salesDao.update(salesPO);
		
		return 0;
	}
	
}
