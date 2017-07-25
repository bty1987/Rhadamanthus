package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.report.dao.PutlineDao;
import com.fanglin.report.po.PutlinePO;
import com.fanglin.report.service.PutlineService;
import com.fanglin.report.vo.PutlineVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("putlineService")
@Transactional(readOnly=true)
public class PutlineServiceImpl implements PutlineService {

	@Autowired
	private PutlineDao putlineDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Override
	public void pagePutline(Paging paging, List<Filter> filters) {
		List<PutlinePO> putlinePOs = putlineDao.pagePutline(paging, filters);
		List<PutlineVO> putlineVOs = new ArrayList<PutlineVO>();
		
		for(PutlinePO putlinePO : putlinePOs){

			PutlineVO putlineVO = new PutlineVO();
			BeanUtil.copyProperties(putlinePO, putlineVO, Arrays.asList("decorationOrder"));
			DecorationOrderVO decorationOrderVO = decorationOrderPOToVO(putlinePO.getDecorationOrder());
			putlineVO.setDecorationOrder(decorationOrderVO);
			putlineVOs.add(putlineVO);
		}
		
		paging.setData(putlineVOs);
	}
	
	private DecorationOrderVO decorationOrderPOToVO(DecorationOrderPO decorationOrderPO){
		
		DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
		
		if(decorationOrderVO.getOrderTotalPrice() == null || decorationOrderVO.getOrderTotalPrice() == 0){
			if(quotationPO == null){
				decorationOrderVO.setOrderTotalPrice(0f);
				decorationOrderVO.setDiscount(0f);
			}else{
				decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
				decorationOrderVO.setDiscount(quotationPO.getDiscount());
			}
		}
		
		if(quotationPO == null){
			decorationOrderVO.setDiscount(0f);
		}else{
			decorationOrderVO.setDiscount(quotationPO.getDiscount());
		}
		
		VillageVO villageVO = new VillageVO();
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper", "buildingNameRule"));
		villageVO.setCityProper(cityProperVO);
		decorationOrderVO.setVillage(villageVO);
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		decorationOrderVO.setCustomer(customerVO);
		
		UserPO supervisor = decorationOrderPO.getSupervisorPO();
		
		if(supervisor != null){
			decorationOrderVO.setSupervisor(supervisor.getCurrentName());
			decorationOrderVO.setSupervisorPhone(supervisor.getPhone());
		}
		
		UserPO designer = decorationOrderPO.getDesignerPO();
		
		decorationOrderVO.setDesigner(designer.getUserName());
		decorationOrderVO.setDesignerId(designer.getUserId());
		decorationOrderVO.setDesignerPhone(designer.getPhone());
		decorationOrderVO.setDesignDepartment(designer.getDept().getDeptName());
		
		UserPO salesman = decorationOrderPO.getSalesmanPO();
		
		decorationOrderVO.setSalesman(salesman.getUserName());
		decorationOrderVO.setSalesmanId(salesman.getUserId());
		decorationOrderVO.setSalesmanPhone(salesman.getPhone());
		decorationOrderVO.setBusinessDepartment(salesman.getDept().getDeptName());
			
		return decorationOrderVO;
	}

}
