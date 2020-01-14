/**
 * @File Name		: MacontrolService.java
 * @Package   	: com.fanglin.factory.service
 * @Version		: 1.0
 * @Date			: 2018-4-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.MacontrolVO;

public interface MacontrolService {

	public List<MacontrolVO> queryMacontrol(MacontrolVO macontrolVO);

	public int checkMacontrol(String userId, List<MacontrolVO> macontrols) throws FLException;

	public int addMacontrol(MacontrolVO macontrolVO);

	public int deleteMacontrol(MacontrolVO macontrolVO);

}
