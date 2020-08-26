package com.fanglin.report.service.impl;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.report.dao.DecorationReportDao;
import com.fanglin.report.po.DecorationReportPO;
import com.fanglin.report.service.DecorationReportService;
import com.fanglin.report.vo.DecorationReportVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("DecorationReportService")
@Transactional(readOnly = true)
public class DecorationReportServiceImpl implements DecorationReportService{

	@Autowired
	private DecorationReportDao decorationReportDao;

	@Override
	public void queryDecoration7Construction(Paging paging, List<Filter> list) throws FLException{

		List<DecorationReportPO> decorationReportPOs = decorationReportDao.queryDecoration7Construction(paging, list);
		List<DecorationReportVO> decorationReportVOs = new ArrayList<DecorationReportVO>();
		DecorationReportVO decorationReportVO;

		for (DecorationReportPO decorationReportPO : decorationReportPOs) {

			decorationReportVO = new DecorationReportVO();
			BeanUtil.copyProperties(decorationReportPO, decorationReportVO, Arrays.asList("company"));
			decorationReportVO.setCompany(decorationReportPO.getCompany().getName());

			decorationReportVOs.add(decorationReportVO);
		}
		
		paging.setData(decorationReportVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updataDecoration7Construction() throws Exception {

		List<Object[]> decorationConstruction = (List<Object[]>) decorationReportDao.countDecorationForConstruction();
		List<Integer> year = Arrays.asList(new Integer[] {2015,2016,2017,2018,2019,2020});
		List<Short> designStatus = Arrays.asList(new Short[] {DecorationPO.DESIGNSTATUS_CONDUCT_INT, DecorationPO.DESIGNSTATUS_END_INT});
		
		decorationConstruction.addAll(decorationReportDao.countDecorationForContract(year));
		
        decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(0, 30, 20));  // 20. 付款比例30% min:最小区间值 max:最大区间值 type:映射属性类型
        decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(31, 64, 21)); // 21. 付款比例65%
        decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(65, 97, 22)); // 22. 付款比例97%
        decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(98, 200, 23));// 23. 付款比例100%
        
		decorationConstruction.addAll(decorationReportDao.countDecorationForDesignStatus(designStatus));//装修单设计状态 24.设计中 25.完成 
		decorationConstruction.addAll(decorationReportDao.countDecorationForDeposit(DecorationPO.STATUS_DEPOSIT_INT));//定金数
		
        decorationReportDao.truncateDecoration7Construction();
		
		Map<Integer, DecorationReportPO> decorationReportPOs = new HashMap<Integer, DecorationReportPO>();

		for (int i = 0;i < decorationConstruction.size();i++){	
			
			Integer company = (Integer) decorationConstruction.get(i)[0];

			if (!decorationReportPOs.containsKey(company)){
				decorationReportPOs.put(company, new DecorationReportPO(new CompanyPO()));
			} 

			DecorationReportPO decorationReportPO = decorationReportPOs.get(company);
			Class<?> clazz = decorationReportPO.getClass();

			Method method = clazz.getMethod("setCs" + decorationConstruction.get(i)[1], int.class);
			method.invoke(decorationReportPO, decorationConstruction.get(i)[2]);
			decorationReportPO.setCompany(new CompanyPO(company));

			decorationReportDao.saveOrUpdate(decorationReportPO);
		}
	}

	
}
