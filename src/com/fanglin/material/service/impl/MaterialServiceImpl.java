/**
 * @File Name		: MaterialServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;


import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.material.dao.MaterialBalanceDao;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.dao.MaterialItemDao;
import com.fanglin.material.po.MaterialBalancePO;
import com.fanglin.material.po.MaterialItemPO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.material.service.MaterialService;
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialService")
@Transactional(readOnly=true)
public class MaterialServiceImpl implements MaterialService {
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private MaterialDao materialDao;
	
	@Autowired
	private MaterialItemDao materialItemDao;
	
	@Autowired
	private MaterialBalanceDao materialBalanceDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Override
	public void pageMaterial(Paging paging, List<Filter> filters){
		
		List<MaterialPO> materialPOs = materialDao.pageMaterial(paging, filters);
		List<MaterialVO> materialVOs = new ArrayList<MaterialVO>();
		
		MaterialVO materialVO;
		
		for(MaterialPO materialPO: materialPOs){
			materialVO = new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO());
			BeanUtil.copyProperties(materialPO, materialVO, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));
			BeanUtil.copyProperties(materialPO.getHouse(), materialVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(materialPO.getHouse().getVillage(), materialVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			
			BeanUtil.copyProperties(materialPO.getCustomer(), materialVO.getCustomer());
			
			BeanUtil.copyProperties(materialPO.getSalesman(), materialVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getMaterialer(), materialVO.getMaterialer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getInstorer(), materialVO.getInstorer(), Arrays.asList("dept", "duty"));
			
			BeanUtil.copyProperties(materialPO.getRegion(), materialVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getDepartment(), materialVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getMaterialDepartment(), materialVO.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			
			materialVOs.add(materialVO);
		}
		
		paging.setData(materialVOs);
	}
	
	@Override
	public void pageMaterialByUserId(Paging paging, List<Filter> filters, String orderId, String userId){
		
		pageMaterialByOrderId(paging, filters, orderId,userId);
		
	}

	@Override
	public void pageMaterialByOrderId(Paging paging, List<Filter> filters, String orderId,String userId){
		
		List<MaterialPO> materialPOs = materialDao.pageMaterialByOrderId(paging, filters, orderId,userId);
		List<MaterialVO> materialVOs = new ArrayList<MaterialVO>();
		
		MaterialVO materialVO;
		
		for(MaterialPO materialPO: materialPOs){
			materialVO = new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO());
			BeanUtil.copyProperties(materialPO, materialVO, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));
			BeanUtil.copyProperties(materialPO.getHouse(), materialVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(materialPO.getHouse().getVillage(), materialVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			
			BeanUtil.copyProperties(materialPO.getCustomer(), materialVO.getCustomer());
			
			BeanUtil.copyProperties(materialPO.getSalesman(), materialVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getMaterialer(), materialVO.getMaterialer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getInstorer(), materialVO.getInstorer(), Arrays.asList("dept", "duty"));
			
			BeanUtil.copyProperties(materialPO.getRegion(), materialVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getDepartment(), materialVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getMaterialDepartment(), materialVO.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			
			materialVOs.add(materialVO);
		}
		
		paging.setData(materialVOs);
	}
	
	@Override
	public void pageMaterialForAdvance(Paging paging, List<Filter> filters, String orderId) {

		List<MaterialPO> materialPOs = materialDao.pageMaterialForAdvance(paging, filters, orderId);
		List<MaterialVO> materialVOs = new ArrayList<MaterialVO>();
		
		MaterialVO materialVO;
		
		for(MaterialPO materialPO: materialPOs){
			materialVO = new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO());
			BeanUtil.copyProperties(materialPO, materialVO, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));
			BeanUtil.copyProperties(materialPO.getHouse(), materialVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(materialPO.getHouse().getVillage(), materialVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			
			BeanUtil.copyProperties(materialPO.getCustomer(), materialVO.getCustomer());
			
			BeanUtil.copyProperties(materialPO.getSalesman(), materialVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getMaterialer(), materialVO.getMaterialer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getInstorer(), materialVO.getInstorer(), Arrays.asList("dept", "duty"));
			
			BeanUtil.copyProperties(materialPO.getRegion(), materialVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getDepartment(), materialVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getMaterialDepartment(), materialVO.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			
			materialVOs.add(materialVO);
		}
		
		paging.setData(materialVOs);
	}
	
	@Override
	public void pageMaterialForPreBalance(Paging paging, List<Filter> filters, String userId,int company){
		
		List<MaterialPO> materialPOs = materialDao.pageMaterialPreBalance(paging, filters,company);
		List<MaterialVO> materialVOs = new ArrayList<MaterialVO>();
		
		MaterialVO materialVO;
		
		for(MaterialPO materialPO: materialPOs){
//			MaterialVO materialVO = new MaterialVO();
//			BeanUtil.copyProperties(materialPO, materialVO);
			materialVO = new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO());
			BeanUtil.copyProperties(materialPO, materialVO, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));
			BeanUtil.copyProperties(materialPO.getHouse(), materialVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(materialPO.getHouse().getVillage(), materialVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			
			BeanUtil.copyProperties(materialPO.getCustomer(), materialVO.getCustomer());
			
			BeanUtil.copyProperties(materialPO.getSalesman(), materialVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getMaterialer(), materialVO.getMaterialer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPO.getInstorer(), materialVO.getInstorer(), Arrays.asList("dept", "duty"));
			
			BeanUtil.copyProperties(materialPO.getRegion(), materialVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getDepartment(), materialVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			BeanUtil.copyProperties(materialPO.getMaterialDepartment(), materialVO.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
			
			materialVOs.add(materialVO);
		}
		
		paging.setData(materialVOs);
	}

	@Override
	public void pageMaterialForPostBalance(Paging paging, List<Filter> filters,int company){

		List<MaterialPO> materialPOs = materialDao.pageMaterialPostBalance(paging, filters,company);
		List<MaterialVO> materialVOs = new ArrayList<MaterialVO>();
		
		for(MaterialPO materialPO: materialPOs){
			MaterialVO materialVO = new MaterialVO();
			BeanUtil.copyProperties(materialPO, materialVO);
			materialVOs.add(materialVO);
		}
		
		paging.setData(materialVOs);
	}

	@Override
	public MaterialVO queryMaterialByMid(MaterialVO materialVO){
		
		MaterialPO materialPO = materialDao.get(materialVO.getMid());
		
		MaterialVO materialVOs = new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO());
		
		BeanUtil.copyProperties(materialPO, materialVOs, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));
		BeanUtil.copyProperties(materialPO.getHouse(), materialVOs.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(materialPO.getHouse().getVillage(), materialVOs.getHouse().getVillage(), Arrays.asList("cityProper"));
		
		BeanUtil.copyProperties(materialPO.getCustomer(), materialVOs.getCustomer());
		
		BeanUtil.copyProperties(materialPO.getSalesman(), materialVOs.getSalesman(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(materialPO.getMaterialer(), materialVOs.getMaterialer(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(materialPO.getInstorer(), materialVOs.getInstorer(), Arrays.asList("dept", "duty"));
		
		BeanUtil.copyProperties(materialPO.getRegion(), materialVOs.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
		BeanUtil.copyProperties(materialPO.getDepartment(), materialVOs.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		BeanUtil.copyProperties(materialPO.getMaterialDepartment(), materialVOs.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		
		return materialVOs;
	}
	
	@Override
	public MaterialVO queryMaterialByNo(MaterialVO materialVO) throws FLException {
		MaterialPO materialPO = materialDao.queryMaterialByNo(materialVO.getNo());
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		MaterialVO materialVOs = new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO());
		
		BeanUtil.copyProperties(materialPO, materialVOs, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));
		BeanUtil.copyProperties(materialPO.getHouse(), materialVOs.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(materialPO.getHouse().getVillage(), materialVOs.getHouse().getVillage(), Arrays.asList("cityProper"));
		
		BeanUtil.copyProperties(materialPO.getCustomer(), materialVOs.getCustomer());
		
		BeanUtil.copyProperties(materialPO.getSalesman(), materialVOs.getSalesman(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(materialPO.getMaterialer(), materialVOs.getMaterialer(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(materialPO.getInstorer(), materialVOs.getInstorer(), Arrays.asList("dept", "duty"));
		
		BeanUtil.copyProperties(materialPO.getRegion(), materialVOs.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
		BeanUtil.copyProperties(materialPO.getDepartment(), materialVOs.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		BeanUtil.copyProperties(materialPO.getMaterialDepartment(), materialVOs.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		
		return materialVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMaterial(MaterialVO materialVO, List<MaterialItemVO> materialItemVOs, String userId,int company) throws FLException{
		
		float total = 0;
		float discountTotal = 0;
		StringBuffer msoNo = null;
		Map<String, List<MaterialItemPO>> packageItems = new HashMap<String, List<MaterialItemPO>>();

		MaterialPO materialPO = new MaterialPO(new HousePO(), new CustomerPO(), new UserPO(), new UserPO(), new UserPO(), new DepartmentPO(), new DepartmentPO() ,new DepartmentPO());
        
		UserPO salesman = userDao.queryUserByUserId(materialVO.getSalesman().getUserId());
		UserPO materialer = userDao.queryUserByUserId(materialVO.getMaterialer().getUserId());
		UserPO instorer = userDao.queryUserByUserId(materialVO.getInstorer().getUserId());
		
		BeanUtil.copyProperties(materialVO, materialPO, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment", "balanceStatus", "company", "coupon", "depositPayment", "depositStatus", "distotal", "fullPayment", "fullStatus", "maling", "otherStatus", "packageFlag", "status", "total", "venderMaling", "mid"));
		BeanUtil.copyProperties(new HousePO(materialVO.getHouse().getHid()), materialPO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(new CustomerPO(materialVO.getCustomer().getCid()), materialPO.getCustomer());
		
		BeanUtil.copyProperties(salesman, materialPO.getSalesman(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(materialer, materialPO.getMaterialer(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(instorer, materialPO.getInstorer(), Arrays.asList("role", "dept", "duty"));
		
		BeanUtil.copyProperties(salesman.getDept().getFatherDept(), materialPO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
		BeanUtil.copyProperties(salesman.getDept(), materialPO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		BeanUtil.copyProperties(materialer.getDept(), materialPO.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		
		String currentData = DateUtil.current(MaterialPO.CURRENT_TIME_FORMAT_STR);
		
		while(true){
			msoNo = new StringBuffer("M");
			msoNo.append(currentData.replace("-", "").substring(2));
			
			int random = new Random().nextInt(9999);
			if(random < 1000){
				random += 1000;
			}
			
			msoNo.append(random);
			
			if(materialDao.queryMaterialByNo(msoNo.toString()) == null){
				break;
			}
		}
		materialPO.setNo(msoNo.toString());
		materialPO.setCompany(company);
		
		Timestamp cuttentTimestamp = DateUtil.getDateToTimestamp(new Date());
		
		materialPO.setCreateTime(cuttentTimestamp);
		materialPO.setPreBalanceTime(cuttentTimestamp);
		materialPO.setPostBalanceTime(cuttentTimestamp);
		materialPO.setCouponInfo("");
		
		materialDao.save(materialPO);
		
		if(materialItemVOs != null){
			
			float _total = MaterialItemServiceImpl.packageMaterialItem(materialPO, materialItemVOs, packageItems);
			float _discountTotal = MaterialItemServiceImpl.setDisCountTotal(materialPO, materialItemVOs);
			total = Arith.add(total, _total);
			discountTotal = Arith.add(discountTotal, _discountTotal);
			for(String packageName: packageItems.keySet()){
				List<MaterialItemPO> tmpItems = packageItems.get(packageName);
				for(MaterialItemPO materialItemPO: tmpItems){
					materialItemDao.save(materialItemPO);
				}
			}
		}
		materialPO.setDistotal(discountTotal);
		materialPO.setTotal(total);
		materialDao.save(materialPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeMaterialForOrderId(String msoNo, String orderId, String userId) throws FLException{
		
		String oldOrderId = "";
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		MaterialPO materialPO = materialDao.queryMaterialByNo(msoNo);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(decorationPO != null && materialPO != null){
			
			oldOrderId = materialPO.getOrderId();
			
			materialPO.setOrderId(orderId);
			
			materialPO.setHouse(decorationPO.getHouse());
			materialPO.setCustomer(decorationPO.getCustomer());
			
			materialDao.update(materialPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_MATERIALSUBORDER_ORDERID_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("主材子订单修改订单编号,主材子订单编号:%s,原订单编号为:%s,修改订单编号为:%s", msoNo, oldOrderId, orderId));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialMaling(MaterialVO materialVO){
		
		MaterialPO materialPO = materialDao.get(materialVO.getMid());
		
		if(materialPO != null){
			materialPO.setMaling(materialVO.getMaling());
			materialPO.setVenderMaling(materialVO.getVenderMaling());
			
			materialDao.update(materialPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialForCoupon(MaterialVO materialVO){
		
		MaterialPO materialPO = materialDao.get(materialVO.getMid());
		
		if(materialPO != null){
			
			materialPO.setCoupon(materialVO.getCoupon());
			materialPO.setCouponInfo(materialVO.getCouponInfo());
			
			materialDao.update(materialPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void passBalanceMaterial(List<Long> mids) {
		
		for(Long mid: mids){
			MaterialPO materialPO = materialDao.get(mid);
			
			if(materialPO != null && materialPO.getStatus() == MaterialPO.STATUS_TYPE_INIT_INT && materialPO.getBalanceStatus() == MaterialPO.BALANCE_STATUS_TYPE_INIT_INT){
				materialPO.setStatus(MaterialPO.STATUS_TYPE_FINISH_INT);
			
				materialDao.update(materialPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void preBalanceMaterial(List<Long> mids, String userId, String userName){
		
		float totalBalance;
		List<String> materialItemPackageNameList = new ArrayList<String>();
		
		for(Long mid: mids){
			MaterialPO materialPO = materialDao.get(mid);
			
			if(materialPO != null && materialPO.getStatus() == MaterialPO.STATUS_TYPE_INIT_INT && materialPO.getBalanceStatus() == MaterialPO.BALANCE_STATUS_TYPE_INIT_INT){
				totalBalance = 0;
				List<MaterialItemPO> materialItemPOs = materialItemDao.queryMaterialItemByMid(mid);
				for(MaterialItemPO materialItemPO: materialItemPOs){
					materialItemPO.setBalanceStatus(MaterialItemPO.BALANCESTATUS_TYPE_PREBALANCE_INT);
					materialItemPO.setPostPoint(materialItemPO.getPrePoint());
					
					float balance = 0;
					
					float salePrice = materialItemPO.getSalePrice(); // 折扣价
					float price = materialItemPO.getPrice(); // 售价
					float total = materialItemPO.getTotal(); // 总价
					float num = materialItemPO.getNum(); // 数量 
					float prePoint = materialItemPO.getPrePoint(); // 预结算点位;
					
					if(!"".equals(materialItemPO.getPackageName())){
						if(materialItemPackageNameList.indexOf(mid.toString() + materialItemPO.getPackageName()) == -1){
							// 利润 : 总价 * 点位 , 成本 : 总价 * (1 - 点位)
							balance = Arith.mul(total, prePoint);
							materialItemPackageNameList.add(mid.toString() + materialItemPO.getPackageName());
						}
					}else{
						if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_BASE_INT){
							// 利润 : (售价 - 底价) * 数量 , 成本 : 底价 * 数量
							balance = Arith.mul((Arith.sub(price, prePoint)), num);
						}else if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_POINT_INT){
							// 利润 : (售价 - 折扣价 * (1 - 点位)) * 数量 , 成本 : 折扣价 * (1 - 点位) * 数量
							balance = Arith.mul(Arith.sub(price, Arith.mul(salePrice, Arith.sub(1f, prePoint))), num);
						}
						
					}
					
					totalBalance = Arith.add(totalBalance, balance); 
					materialItemDao.update(materialItemPO);
				}
				
				totalBalance = Arith.sub(totalBalance, materialPO.getMaling());
				
				materialPO.setPreBalanceTime(DateUtil.getDateToTimestamp(new Date()));
				materialPO.setStatus(MaterialPO.STATUS_TYPE_PREBALANCE_INT);
				materialPO.setBalanceStatus(MaterialPO.BALANCE_STATUS_TYPE_PRE_INT);
				materialDao.update(materialPO);
				
				MaterialBalancePO materialBalancePO = new MaterialBalancePO();
				materialBalancePO.setMaterial(materialPO);
				materialBalancePO.setCreater(userDao.queryUserByUserId(userId));
				materialBalancePO.setInstorer(materialPO.getInstorer() == null ? null : userDao.queryUserByUserId(materialPO.getInstorer().getUserId()));
				materialBalancePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
				materialBalancePO.setBalance(totalBalance);
				materialBalancePO.setDifference(Arith.sub(materialPO.getTotal(), totalBalance));
				materialBalancePO.setType(MaterialBalancePO.TYPE_ADD_INT);
				materialBalancePO.setStatus(MaterialBalancePO.STATUS_PRE_BALANCE_INT);
				materialBalancePO.setTotal(materialPO.getTotal());
				materialBalanceDao.save(materialBalancePO);
			}
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void postBalanceMaterial(MaterialVO materialVO, String userId, String userName) throws FLException{
		
		long mid = materialVO.getMid();
		
		float totalBalance;
		List<String> materialItemPackageNameList = new ArrayList<String>();
		
		MaterialPO materialPO = materialDao.get(mid);
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		totalBalance = 0;
		
		if(materialPO != null && materialPO.getBalanceStatus() == MaterialItemPO.BALANCESTATUS_TYPE_PREBALANCE_INT){
			materialPO.setBalanceStatus(MaterialPO.BALANCE_STATUS_TYPE_POST_INT);
			
			List<MaterialItemPO> materialItemPOs = materialItemDao.queryMaterialItemByMid(mid);
			for(MaterialItemPO materialItemPO: materialItemPOs){
				materialItemPO.setBalanceStatus(MaterialItemPO.BALANCESTATIS_TYPE_POSTBALANCE_INT);
				
				float balance = 0;
				
				float salePrice = materialItemPO.getSalePrice(); // 折扣价
				float num = materialItemPO.getNum();
				float total = materialItemPO.getTotal();
				float prePoint = materialItemPO.getPrePoint();
				float postPoint = materialItemPO.getPostPoint();
				
				if(!"".equals(materialItemPO.getPackageName())){
					if(materialItemPackageNameList.indexOf(String.valueOf(mid) + materialItemPO.getPackageName()) == -1){
						// 利润 : 总价 * (结算点位 - 预结算点位) * 0.5 , 成本 : 总价 * (预结算点位 - 结算点位)
						balance = Arith.mul(total, Arith.sub(postPoint, prePoint));
						
						materialItemPackageNameList.add(String.valueOf(mid) + materialItemPO.getPackageName());
					}
				}else{
					if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (预结算底价 - 结算底价) * 数量 * 0.5 , 成本 : (结算底价 - 预结算底价) * 数量
						balance = Arith.mul(Arith.sub(prePoint, postPoint), num);
					}else if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : 折扣价 * (结算点位 - 预结算点位) * 数量 * 0.5 , 成本 : 折扣价 * (预结算点位 - 结算点位) * 数量
						balance = Arith.mul(Arith.mul(salePrice, Arith.sub(postPoint, prePoint)), num);
					}
				}
				
				totalBalance = Arith.add(totalBalance, balance);
				
				materialItemDao.update(materialItemPO);
			}
			
			materialPO.setPostBalanceTime(DateUtil.getDateToTimestamp(new Date()));
			materialPO.setStatus(MaterialPO.STATUS_TYPE_POSTBALANCE_INT);
			materialPO.setBalanceStatus(MaterialPO.BALANCE_STATUS_TYPE_POST_INT);
			
			materialDao.update(materialPO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteMaterial(long mid) throws FLException{
		
		MaterialPO materialPO = materialDao.get(mid);
		
		if(materialPO != null){
			
			if(materialPO.getStatus() == MaterialPO.STATUS_TYPE_INIT_INT && materialPO.getBalanceStatus() == MaterialPO.BALANCE_STATUS_TYPE_INIT_INT && 
				materialPO.getFullStatus() == MaterialPO.FINANCE_STATUS_TYPE_INIT_INT && materialPO.getDepositStatus() == MaterialPO.FINANCE_STATUS_TYPE_INIT_INT){
				
				materialItemDao.deleteMaterialItemByMid(mid);
				
				materialPO.setStatus(MaterialPO.STATUS_TYPE_DELETE_INT);
				
				materialDao.update(materialPO);
				
				return 0;
			}
		}
		
		throw new FLException(180009, "主材订单当前状态不能删除");
	}
}
