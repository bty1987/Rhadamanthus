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
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
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
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
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
	
	@Autowired
	private CompanyDao companyDao;
	
	@Autowired
	private BrandDao brandDao;
	
	@Override
	public List<SalesVO> pageSales(List<SalesPO> salesPOs) {
		
		List<SalesVO> salesVOs = new ArrayList<SalesVO>();
		
		for(SalesPO salesPO:salesPOs){
			
			SalesVO _salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(salesPO, _salesVO, Arrays.asList("salesman","dept","region","guider","instorer","guideDept","house","customer"));
			BeanUtil.copyProperties(salesPO.getSalesman(), _salesVO.getSalesman(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getDept(), _salesVO.getDept(),Arrays.asList("fatherDept","type","manager"));
			BeanUtil.copyProperties(salesPO.getRegion(), _salesVO.getRegion(),Arrays.asList("fatherDept","type","manager"));
			BeanUtil.copyProperties(salesPO.getInstorer(), _salesVO.getInstorer(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuider(), _salesVO.getGuider(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), _salesVO.getGuideDept(),Arrays.asList("fatherDept","type","manager"));
			BeanUtil.copyProperties(salesPO.getHouse(), _salesVO.getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), _salesVO.getHouse().getVillage(),Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getCustomer(), _salesVO.getCustomer());
			
			salesVOs.add(_salesVO);
		}
		
		return salesVOs;
	}
	
	@Override
	public void pageSales(Paging paging, List<Filter> filter,String userId,int company) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		Integer id = userPO.getUid();
		
		List<SalesPO> salesPOs = salesDao.pageSales(paging, filter,company,id);
		List<SalesVO> salesVOs = pageSales(salesPOs);
		
		paging.setData(salesVOs); 

	}
	
	@Override
	public void pageSalesForAdvance(Paging paging, List<Filter> filter,String userId,int company) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<SalesPO> salesPOs = salesDao.pageSalesForAdvance(paging, filter, company);
		List<SalesVO> salesVOs = pageSales(salesPOs);
		
		paging.setData(salesVOs); 

	}
	
	@Override
	public void pageSalesForBalance(Paging paging, List<Filter> filter,String userId, int company) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<SalesPO> salesPOs = salesDao.pageSalesForBalance(paging, filter,company);
		List<SalesVO> salesVOs = pageSales(salesPOs);
		
		paging.setData(salesVOs); 
		
	}
	
	@Override
	public void pageSalesForDompany(Paging paging, List<Filter> filter,String userId,int dompany) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<SalesPO> salesPOs = salesDao.pageSalesForDompany(paging, filter, dompany);
		List<SalesVO> salesVOs = pageSales(salesPOs);
		
		paging.setData(salesVOs); 

	}
	
	@Override
	public void pageSalesForBalanceByDompany(Paging paging, List<Filter> filter,String userId, int dompany) {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<SalesPO> salesPOs = salesDao.pageSalesForBalanceByDompany(paging, filter,dompany);
		List<SalesVO> salesVOs = pageSales(salesPOs);
		
		paging.setData(salesVOs); 
	}

	@Override
	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException{
		
		SalesPO salesPO = salesDao.get(salesVO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
		
		salesPO.ptv(salesVO);
		
		return salesVO;
	}
	
	@Override
	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.querySalesByNo(salesVO.getNo());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}

		salesVO = new SalesVO(new HouseVO(new VillageVO()),new CustomerVO(),new UserBaseVO(),new DepartmentVO(),new DepartmentVO(),new UserBaseVO(),new DepartmentVO(),new UserBaseVO());
		
		salesPO.ptv(salesVO);
		
		return salesVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSales(SalesVO salesVO, List<SalesItemVO> salesItemVOs, int company) throws FLException {
		
		int dompany;
		
		try {
			
			dompany = FormatUtil.decodeCompany(AESHelper.decryptString(salesVO.getDompanys(), SystemConfig.getString("encryptKey")));
			
		} catch (Exception e) {
			
			throw new FLException(230015 , "公司不存在");
			
		}
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		Float totalMoney = 0f;
			
		SalesPO salesPO = new SalesPO(new HousePO(), new CustomerPO(), new UserPO(), new DepartmentPO(), new DepartmentPO(), new UserPO(), new DepartmentPO(), new UserPO());
		
		UserPO salesman = userDao.queryUserByUserId(salesVO.getSalesman().getUserId());
		UserPO guider = userDao.queryUserByUserId(salesVO.getGuider().getUserId());
		UserPO instorer = userDao.queryUserByUserId(salesVO.getInstorer().getUserId());
		BrandPO brandPO = brandDao.get(salesVO.getBid());
		
		String salesBrand = brandPO.getName();
		
		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT , currentDate, company);
		
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		BeanUtil.copyProperties(salesVO, salesPO, Arrays.asList("salesman","dept","region","guider","instorer","brand","category","guideDept","house","customer","maling","venderMaling","depositpayStatus","fullpayStatus"));
		BeanUtil.copyProperties(salesman, salesPO.getSalesman(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesman.getDept(), salesPO.getDept(),Arrays.asList("fatherDept","type","manager"));
		BeanUtil.copyProperties(salesman.getDept().getFatherDept(), salesPO.getRegion(),Arrays.asList("fatherDept","type","manager"));
		BeanUtil.copyProperties(instorer, salesPO.getInstorer(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(guider, salesPO.getGuider(),Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(guider.getDept(), salesPO.getGuideDept(),Arrays.asList("fatherDept","type","manager"));
		BeanUtil.copyProperties(new HousePO(salesVO.getHouse().getHid()), salesPO.getHouse(),Arrays.asList("village"));
		BeanUtil.copyProperties(new CustomerPO(salesVO.getCustomer().getCid()), salesPO.getCustomer());
		
		salesPO.setBrand(brandPO.getName());
		salesPO.setCategory(brandPO.getCategory().getName());
		salesPO.setMaling(0);
		salesPO.setVenderMaling(salesVO.getMaling());
		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setFullpay(0);
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
				
				totalMoney = Arith.add(totalMoney, salesItemPO.getTotal());
				
			}
		}
		
		if(totalMoney != salesPO.getTotal()){
			throw new FLException(150025, "款项金额不正确");
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
		
		salesPO.setMaling(salesVO.getMaling());
		salesPO.setVenderMaling(salesVO.getVenderMaling());
		
		salesDao.update(salesPO);
		
		return 0;
	}

}
