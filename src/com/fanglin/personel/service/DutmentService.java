package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.DutmentVO;

public interface DutmentService {

	public List<DutmentVO> queryDutmentByDeid(DutmentVO dutmentVO, int company);

	public List<DutmentVO> queryDutmentByDuid(DutmentVO dutmentVO, int company);

	public DutmentVO queryDutmentByDid(DutmentVO dutmentVO);

	public int addDutment(DutmentVO dutmentVO, int company) throws FLException;

	public int updateDutment(DutmentVO dutmentVO) throws FLException;

	public int deleteDutment(DutmentVO dutmentVO);

}
