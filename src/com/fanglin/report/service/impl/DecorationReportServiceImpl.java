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
	@SuppressWarnings("unchecked")
	@Transactional(rollbackFor = Exception.class)
	public void updataDecoration7Construction() throws Exception {

		List<Object[]> decorations = (List<Object[]>) decorationReportDao.queryDecorationConstruction();
		List<Object[]> oldDcidACdids = (List<Object[]>) decorationReportDao.queryDecorationConstructionAllCdidADcid();
		Map<Integer, DecorationReportPO> decorationReportPOs = new HashMap<Integer, DecorationReportPO>();
		Map<Integer, Integer> mapOldDcidACdids = new HashMap<Integer, Integer>();

		for (int i = 0; i < oldDcidACdids.size(); i++) {

			Integer company = (Integer)oldDcidACdids.get(i)[0];
			Integer dcid = (Integer)oldDcidACdids.get(i)[1];
			mapOldDcidACdids.put(company, dcid);
		}

		for (int i = 0;i < decorations.size();i++){	

			Integer company = (Integer) decorations.get(i)[0];

			if (!decorationReportPOs.containsKey(company)){

				decorationReportPOs.put(company, new DecorationReportPO(new CompanyPO()));
			} 

			DecorationReportPO decorationReportPO = decorationReportPOs.get(company);
			Class<?> clazz = decorationReportPO.getClass();

			Method method = clazz.getMethod("setCs" + decorations.get(i)[1], int.class);
			method.invoke(decorationReportPO, decorations.get(i)[2]);
			decorationReportPO.setCompany(new CompanyPO(company));

			if (mapOldDcidACdids.containsKey(company)){

				Integer companyDcid = mapOldDcidACdids.get(company);
				decorationReportPO.setDcid(companyDcid);
				decorationReportDao.merge(decorationReportPO);
			} else {
				decorationReportDao.save(decorationReportPO);
			}

		}
	}

}
