/**
 * @File Name		: MaterialReportService.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.QuotationRankDao;
import com.fanglin.report.service.QuotationRankService;
import com.fanglin.report.vo.AddReduceRankVO;

@Service("quotationRankServiceImpl")
@Transactional(readOnly = true)
public class QuotationRankServiceImpl implements QuotationRankService {

	@Autowired
	private QuotationRankDao quotationRankDao;

	@Override
	public List<AddReduceRankVO> rankAddReduce(int company) {

		List<AddReduceRankVO> addReduceRankVOs = new ArrayList<AddReduceRankVO>();

		List<?> _ = quotationRankDao.rankAddReduce(company);

		if (_.size() > 0) {

			for (int i = 0; i < _.size(); i++) {
				AddReduceRankVO addReduceRankVO = new AddReduceRankVO();
				Object[] infos = (Object[]) _.get(i);
				addReduceRankVO.setname(infos[0].toString());
				addReduceRankVO.setCount(infos[1].toString());
				addReduceRankVO.setTotal(Integer.parseInt(infos[2].toString()));
				addReduceRankVOs.add(addReduceRankVO);
			}

		}

		return addReduceRankVOs;
	}
}
