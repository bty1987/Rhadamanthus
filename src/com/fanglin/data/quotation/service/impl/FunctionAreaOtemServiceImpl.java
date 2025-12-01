/**
 * @File Name		: FunctionAreaServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.FunctionAreaOptionPO;
import com.fanglin.data.po.FunctionAreaOtemPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaOptionDao;
import com.fanglin.data.quotation.dao.FunctionAreaOtemDao;
import com.fanglin.data.quotation.service.FunctionAreaOtemService;
import com.fanglin.data.quotation.vo.FunctionAreaOptionVO;
import com.fanglin.data.quotation.vo.FunctionAreaOtemVO;
import com.fanglin.utils.BeanUtil;

@Service("functionAreaOtemService")
@Transactional(readOnly = true)
public class FunctionAreaOtemServiceImpl implements FunctionAreaOtemService {

	@Autowired
	private FunctionAreaOtemDao functionAreaOtemDao;

	@Autowired
	private FunctionAreaOptionDao functionAreaOptionDao;

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Override
	public List<FunctionAreaOtemVO> queryFunctionAreaOtem(FunctionAreaOtemVO functionAreaOtemVO) throws FLException {

		List<FunctionAreaOtemPO> functionAreaOtemPOs = functionAreaOtemDao.queryFunctionAreaOtemByFaid(functionAreaOtemVO.getFaid());
		List<FunctionAreaOtemVO> functionAreaOtemVOs = new ArrayList<FunctionAreaOtemVO>();

		for (FunctionAreaOtemPO otemPO : functionAreaOtemPOs) {

			FunctionAreaOtemVO otemVO = new FunctionAreaOtemVO(new ArrayList<FunctionAreaOptionVO>());

			BeanUtil.copyPropertie(otemPO, otemVO, Arrays.asList("options"));

			for (FunctionAreaOptionPO optionPO : otemPO.getOptions()) {

				FunctionAreaOptionVO optionVO = new FunctionAreaOptionVO();

				BeanUtil.copyPropertie(optionPO, optionVO);

				otemVO.getOptions().add(optionVO);
			}

			functionAreaOtemVOs.add(otemVO);
		}

		return functionAreaOtemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public FunctionAreaOtemVO makeFunctionAreaOtem(List<FunctionAreaOtemVO> functionAreaOtemVOs, FunctionAreaOtemVO functionAreaOtemVO) throws FLException {

		FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaOtemVO.getFaid());

		if (functionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		functionAreaOtemDao.deleteFunctionAreaOtemByFaid(functionAreaOtemVO.getFaid());
		functionAreaOptionDao.deleteFunctionAreaOptionByFaid(functionAreaOtemVO.getFaid());

		for (FunctionAreaOtemVO otemVO : functionAreaOtemVOs) {

			FunctionAreaOtemPO otemPO = new FunctionAreaOtemPO();

			BeanUtil.copyPropertie(otemVO, otemPO, Arrays.asList("options"));

			otemPO.setFaid(functionAreaOtemVO.getFaid());

			functionAreaOtemDao.save(otemPO);

			if (otemVO.getType() == FunctionAreaOtemPO.TYPE_TEXT_INT || otemVO.getType() == FunctionAreaOtemPO.TYPE_INPUT_INT || otemVO.getType() == FunctionAreaOtemPO.TYPE_DATE_INT) continue;

			List<FunctionAreaOptionVO> options = otemVO.getOptions();

			if (options == null) continue;

			for (FunctionAreaOptionVO optionVO : options) {

				FunctionAreaOptionPO optionPO = new FunctionAreaOptionPO();

				BeanUtil.copyPropertie(optionVO, optionPO);

				optionPO.setFaid(otemPO.getFaid());
				optionPO.setFaiid(otemPO.getFaiid());

				functionAreaOptionDao.save(optionPO);
			}
		}

		return functionAreaOtemVO;
	}

}
