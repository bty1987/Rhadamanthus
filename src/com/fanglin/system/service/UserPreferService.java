package com.fanglin.system.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.vo.UserPreferVO;

public interface UserPreferService {

    public UserPreferVO queryUserPrefer(UserPreferVO userPreferVO, String userId, int company) throws FLException;

    public int updateUserPrefer(UserPreferVO userPreferVO, String userId, int company) throws FLException;

}
