package com.sample.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.sample.service.SampleService;


@Controller
public class SampleController {
    Logger log = Logger.getLogger(this.getClass()); //log4j.xml 설정
    
    @Resource(name="sampleService")
    private SampleService sampleService;
    
    @RequestMapping(value="/sample/openSampleBoardList.do")
    public ModelAndView openSampleBoardList(Map<String, Object> commandMap) throws Exception{
        ModelAndView mv = new ModelAndView("/sample/boardList");
        System.out.println("헬로월드");
        List<Map<String,Object>> list = sampleService.selectBoardList(commandMap);
        mv.addObject("list", list);
         
        return mv;
    }


    
//    @RequestMapping(value="/sample/openSampleList.do")
//    public ModelAndView openSampleList(Map<String,Object> commandMap) throws Exception{
//        ModelAndView mv = new ModelAndView("");
//        log.debug("인터셉터 테스트");
//         
//        return mv;
//    }

}
