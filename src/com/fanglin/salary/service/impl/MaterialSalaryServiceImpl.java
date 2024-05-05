package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.MaterialSalaryDao;
import com.fanglin.salary.po.MaterialSalaryPO;
import com.fanglin.salary.service.MaterialSalaryService;
import com.fanglin.salary.vo.MaterialSalaryVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialSalaryService")
@Transactional(readOnly = true)
public class MaterialSalaryServiceImpl implements MaterialSalaryService {

	@Autowired
	private MaterialSalaryDao materialSalaryDao;

	@Override
	public void pageMaterialSalary(Paging paging, List<Filter> filters, MaterialSalaryVO materialSalaryVO) throws FLException {

		if (materialSalaryVO == null) {
			materialSalaryVO = new MaterialSalaryVO();
		}

		if (materialSalaryVO.getBelonger() != null) {
			filters.add(new Filter("userId", materialSalaryVO.getBelonger().getUserId(), "eq"));
		}

		if (materialSalaryVO.getCreateTime() != null) {

			String start = DateUtil.getDateToDateString(DateUtil.getFirstDay(DateUtil.getTimestampToDate(materialSalaryVO.getCreateTime())), "yyyy/MM/dd");
			String end = DateUtil.getDateToDateString(DateUtil.getLastDay(DateUtil.getTimestampToDate(materialSalaryVO.getCreateTime())), "yyyy/MM/dd");

			filters.add(new Filter("createTime", String.format("%s-%s", start, end), "eq"));
		}

		List<MaterialSalaryPO> materialSalaryPOs = materialSalaryDao.pageMaterialSalary(paging, filters);
		List<MaterialSalaryVO> materialSalaryVOs = new ArrayList<MaterialSalaryVO>();

		for (MaterialSalaryPO materialSalaryPO : materialSalaryPOs) {

			materialSalaryVO = new MaterialSalaryVO(new DecorationVO(), new SalesVO(), new UserBaseVO());

			BeanUtil.copyProperties(materialSalaryPO, materialSalaryVO, Arrays.asList("decoration", "sales", "belonger"));

			materialSalaryVO.getBelonger().setBaseInfo(materialSalaryPO.getBelonger());

			if (materialSalaryPO.getDecoration() != null) materialSalaryPO.getDecoration().ptvcascade(materialSalaryVO.getDecoration());
			if (materialSalaryPO.getSales() != null) materialSalaryPO.getSales().ptv(materialSalaryVO.getSales());

			materialSalaryVOs.add(materialSalaryVO);
		}

		paging.setData(materialSalaryVOs);
	}
}
